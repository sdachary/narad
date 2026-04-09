---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/.github/workflows/destroy-client.yml"
project: "vishwakarma"
role: config
language: yaml
frameworks: [docker, github-actions]
lines: 247
size: 11667 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, config, docker, github-actions, project/vishwakarma, yaml]
---

# destroy-client.yml

> Configuration file for the project using **docker, github-actions** (247 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/.github/workflows/destroy-client.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | docker, github-actions |
| **Lines** | 247 |
| **Size** | 11667 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Destroy Client

# ─────────────────────────────────────────────────────────────────────────────
# Triggered by: vishwakarma worker → POST /api/clients/:id/destroy
#
# Payload shape (from worker):
#   clientId          string   — project name (e.g. pcloud-deepakshar-a3f2)
#   region            string
#   ociTenancyOcid    string   — base64 or raw
#   ociUserOcid       string
#   ociFingerprint    string
#   ociPrivateKey     string   — always base64-encoded PEM from worker
#   storageSize       number   — needed for tfvars (volume_size must match what was provisioned)
# ─────────────────────────────────────────────────────────────────────────────

on:
  repository_dispatch:
    types: [destroy-client]

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: 'true'
  NODE_OPTIONS: '--no-deprecation'
  CALLBACK_BASE: 'https://vishwakarma-ops.pages.dev'
  TF_WORKSPACE: 'client-provisioning'
  TF_ORG: 'd-cloud'

jobs:
  destroy:
    runs-on: ubuntu-latest
    timeout-minutes: 20

    defaults:
      run:
        working-directory: terraform

    steps:

      # ── 1. Checkout ────────────────────────────────────────────────
      - name: Checkout
        uses: actions/checkout@v4

      # ── 2. Terraform setup ─────────────────────────────────────────
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: 1.6.6
          cli_config_credentials_hostname: app.terraform.io
          cli_config_credentials_token: ${{ secrets.TF_API_TOKEN }}

      # ── 3. Extract and mask all inputs ─────────────────────────────
      - name: Extract Client Info
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          CLIENT_ID="${{ github.event.client_payload.clientId }}"
          OCI_REGION="${{ github.event.client_payload.region || 'ap-hyderabad-1' }}"
          STORAGE_SIZE="${{ github.event.client_payload.storageSize || 150 }}"

          OCI_TENANCY="${{ secrets.OCI_TENANCY_OCID || github.event.client_payload.ociTenancyOcid }}"
          OCI_USER="${{ secrets.OCI_USER_OCID || github.event.client_payload.ociUserOcid }}"
          OCI_FINGER="${{ secrets.OCI_FINGERPRINT || github.event.client_payload.ociFingerprint }}"
          OCI_KEY_RAW="${{ secrets.OCI_PRIVATE_KEY || github.event.client_payload.ociPrivateKey }}"

          echo "::add-mask::$CLIENT_ID"
          echo "::add-mask::$OCI_TENANCY"
          echo "::add-mask::$OCI_USER"
          echo "::add-mask::$OCI_FINGER"
          echo "::add-mask::$OCI_KEY_RAW"

          ERROR=0
          [ -z "$CLIENT_ID" ]   && echo "::error::clientId is missing"           && ERROR=1
          [ -z "${{ secrets.TF_API_TOKEN }}" ] && echo "::error::TF_API_TOKEN not set" && ERROR=1

          if [ -z "$OCI_TENANCY" ] || [ -z "$OCI_USER" ] || [ -z "$OCI_FINGER" ] || [ -z "$OCI_KEY_RAW" ]; then
            echo "::notice::Missing OCI credentials. Assuming serverless client. Proceeding directly to marked destroyed."
            
            # Send destroyed hooks directly
            curl -sf -X PATCH \
              "${{ env.CALLBACK_BASE }}/api/clients/$CLIENT_ID/logs" \
              -H "Content-Type: application/json" \
              -d '{"level":"success","message":"✅ Serverless client marked as destroyed (no infrastructure)"}' || true
              
            curl -sf -X POST \
              "${{ env.CALLBACK_BASE }}/api/clients/$CLIENT_ID/complete" \
              -H "Content-Type: application/json" \
              -d '{"status":"destroyed"}' || true
              
            gh run cancel ${{ github.run_id }}
            sleep 60
            exit 0
          fi

          [ $ERROR -eq 1 ] && exit 1
          echo "✅ All required inputs present"

          {
            echo "CLIENT_ID=$CLIENT_ID"
            echo "OCI_REGION=$OCI_REGION"
            echo "STORAGE_SIZE=$STORAGE_SIZE"
            echo "OCI_TENANCY=$OCI_TENANCY"
            echo "OCI_USER=$OCI_USER"
            echo "OCI_FINGER=$OCI_FINGER"
            echo "OCI_KEY_RAW=$OCI_KEY_RAW"
          } >> "$GITHUB_ENV"

      # ── 4. Decode and validate OCI PEM ────────────────────────────
      - name: Decode OCI Private Key
        env:
          OCI_KEY: ${{ env.OCI_KEY_RAW }}
        run: |
          if echo "$OCI_KEY" | grep -q "BEGIN"; then
            printf '%s' "$OCI_KEY" | base64 -w 0 | base64 -d > /tmp/oci_api_key.pem
          else
            printf '%s' "$OCI_KEY" | base64 -d > /tmp/oci_api_key.pem
          fi
          chmod 600 /tmp/oci_api_key.pem
          head -1 /tmp/oci_api_key.pem | grep -q "BEGIN" || { echo "::error::Invalid PEM"; exit 1; }
          LINES=$(wc -l < /tmp/oci_api_key.pem)
          [ "$LINES" -lt 10 ] && { echo "::error::PEM too short ($LINES lines)"; exit 1; }
          echo "✅ OCI key decoded: $LINES lines"

      # ── 5. Notify: destroy starting ───────────────────────────────
      - name: Log — Destroy Starting
        run: |
          curl -sf -X PATCH \
            "${{ env.CALLBACK_BASE }}/api/clients/${{ env.CLIENT_ID }}/logs" \
            -H "Content-Type: application/json" \
            -d '{"level":"warn","message":"🗑 Destroy workflow started — removing OCI infrastructure..."}' || true

      # ── 6. Set Terraform Cloud workspace variables ─────────────────
      - name: Set Terraform Cloud Variables
        env:
          TF_API_TOKEN: ${{ secrets.TF_API_TOKEN }}
        run: |
          WORKSPACE_RESPONSE=$(curl -sf \
            -H "Authorization: Bearer $TF_API_TOKEN" \
            -H "Content-Type: application/vnd.api+json" \
            "https://app.terraform.io/api/v2/organizations/${{ env.TF_ORG }}/workspaces/${{ env.TF_WORKSPACE }}")

          WORKSPACE_ID=$(echo "$WORKSPACE_RESPONSE" | jq -r '.data.id')
          [ -z "$WORKSPACE_ID" ] || [ "$WORKSPACE_ID" = "null" ] && {
            echo "::error::Failed to get workspace ID"
            exit 1
          }
          echo "✅ Workspace: $WORKSPACE_ID"

          PRIVATE_KEY=$(cat /tmp/oci_api_key.pem)

          upsert_var() {
            local KEY=$1 VALUE=$2 SENSITIVE=$3
            EXISTING=$(curl -sf \
              -H "Authorization: Bearer $TF_API_TOKEN" \
              -H "Content-Type: application/vnd.api+json" \
              "https://app.terraform.io/api/v2/workspaces/${WORKSPACE_ID}/vars" \
              | jq -r --arg k "$KEY" '.data[] | select(.attributes.key == $k) | .id')
            BODY=$(jq -n \
              --arg key "$KEY" --arg value "$VALUE" --argjson sensitive "$SENSITIVE" \
              '{data:{type:"vars",attributes:{key:$key,value:$value,sensitive:$sensitive,category:"terraform"}}}')
            if [ -n "$EXISTING" ]; then
              curl -sf -X PATCH \
                -H "Authorization: Bearer $TF_API_TOKEN" \
                -H "Content-Type: application/vnd.api+json" \
                "https://app.terraform.io/api/v2/workspaces/${WORKSPACE_ID}/vars/${EXISTING}" \
                -d "$BODY" > /dev/null && echo "  Updated: $KEY"
            else
              curl -sf -X POST \
                -H "Authorization: Bearer $TF_API_TOKEN" \
                -H "Content-Type: application/vnd.api+json" \
                "https://app.terraform.io/api/v2/workspaces/${WORKSPACE_ID}/vars" \
                -d "$BODY" > /dev/null && echo "  Created: $KEY"
            fi
          }

          upsert_var "tenancy_ocid" "${{ env.OCI_TENANCY }}" true
          upsert_var "user_ocid"    "${{ env.OCI_USER }}"    true
          upsert_var "fingerprint"  "${{ env.OCI_FINGER }}"  true
          upsert_var "private_key"  "$PRIVATE_KEY"           true
          upsert_var "region"       "${{ env.OCI_REGION }}"  false

      # ── 7. Write tfvars for destroy ────────────────────────────────
      # Must match the values used during provision so Terraform can
      # identify and destroy the correct resources.
      - name: Create TFVars
        run: |
          mkdir -p ../clients
          cat > "../clients/${{ env.CLIENT_ID }}.tfvars" << TFEOF
          client_name              = "${{ env.CLIENT_ID }}"
          compartment_ocid         = ""
          shape                    = "VM.Standard.E2.1.Micro"
          volume_size              = ${{ env.STORAGE_SIZE }}
          nextcloud_admin_password = "destroy-placeholder"
          nextcloud_admin_email    = "destroy@placeholder.com"
          nextcloud_version        = "28"
          install_pihole           = false
          install_tailscale        = false
          install_vaultwarden      = false
          install_n8n              = false
          install_uptime_kuma      = false
          project_name             = "${{ env.CLIENT_ID }}"
          use_case_id              = "destroy"
          TFEOF

          sed -i 's/^[[:space:]]*//' "../clients/${{ env.CLIENT_ID }}.tfvars"
          echo "✅ TFVars written"

      # ── 8. Terraform init + destroy ────────────────────────────────
      - name: Terraform Init
        env:
          TF_API_TOKEN: ${{ secrets.TF_API_TOKEN }}
        run: terraform init

      - name: Log — Destroying Infrastructure
        run: |
          curl -sf -X PATCH \
            "${{ env.CALLBACK_BASE }}/api/clients/${{ env.CLIENT_ID }}/logs" \
            -H "Content-Type: application/json" \
            -d '{"level":"warn","message":"💥 Destroying OCI VM, VCN, and block volume..."}' || true

      - name: Terraform Destroy
        env:
          TF_API_TOKEN: ${{ secrets.TF_API_TOKEN }}
        run: |
          terraform destroy \
            -auto-approve \
            -var-file="../clients/${{ env.CLIENT_ID }}.tfvars"

      # ── 9. Mark complete ───────────────────────────────────────────
      - name: Mark Destroyed
        run: |
          curl -sf -X PATCH \
            "${{ env.CALLBACK_BASE }}/api/clients/${{ env.CLIENT_ID }}/logs" \
            -H "Content-Type: application/json" \
            -d '{"level":"success","message":"✅ Infrastructure destroyed — all OCI resources removed"}' || true

          curl -sf -X POST \
            "${{ env.CALLBACK_BASE }}/api/clients/${{ env.CLIENT_ID }}/complete" \
            -H "Content-Type: application/json" \
            -d '{"status":"destroyed"}' || true

      # ── 10. Failure handler ────────────────────────────────────────
      - name: Handle Failure
        if: failure()
        run: |
          curl -sf -X PATCH \
            "${{ env.CALLBACK_BASE }}/api/clients/${{ env.CLIENT_ID }}/logs" \
            -H "Content-Type: application/json" \
            -d '{"level":"error","message":"❌ Destroy failed — OCI resources may still exist. Check GitHub Actions for details."}' || true

```

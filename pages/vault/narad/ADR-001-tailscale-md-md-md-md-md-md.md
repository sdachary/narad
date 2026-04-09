---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ADR-001-tailscale-md-md-md-md-md.md"
project: "narad"
role: deployment
language: markdown
frameworks: [docker, terraform]
lines: 608
size: 14223 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [deployment, docker, documentation, markdown, project/narad, terraform]
---

# ADR-001-tailscale-md-md-md-md-md.md

> Deployment / infrastructure config using **docker, terraform** (608 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ADR-001-tailscale-md-md-md-md-md.md` |
| **Role** | deployment |
| **Language** | markdown |
| **Frameworks** | docker, terraform |
| **Lines** | 608 |
| **Size** | 14223 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ADR-001-tailscale-md-md-md-md.md"
project: "narad"
role: deployment
language: markdown
frameworks: [docker, terraform]
lines: 570
size: 13365 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [deployment, docker, documentation, markdown, project/narad, terraform]
---

# ADR-001-tailscale-md-md-md-md.md

> Deployment / infrastructure config using **docker, terraform** (570 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ADR-001-tailscale-md-md-md-md.md` |
| **Role** | deployment |
| **Language** | markdown |
| **Frameworks** | docker, terraform |
| **Lines** | 570 |
| **Size** | 13365 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ADR-001-tailscale-md-md-md.md"
project: "narad"
role: deployment
language: markdown
frameworks: [docker, terraform]
lines: 532
size: 12516 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [deployment, docker, documentation, markdown, project/narad, terraform]
---

# ADR-001-tailscale-md-md-md.md

> Deployment / infrastructure config using **docker, terraform** (532 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ADR-001-tailscale-md-md-md.md` |
| **Role** | deployment |
| **Language** | markdown |
| **Frameworks** | docker, terraform |
| **Lines** | 532 |
| **Size** | 12516 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ADR-001-tailscale-md-md.md"
project: "narad"
role: deployment
language: markdown
frameworks: [docker, terraform]
lines: 494
size: 11676 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [deployment, docker, documentation, markdown, project/narad, terraform]
---

# ADR-001-tailscale-md-md.md

> Deployment / infrastructure config using **docker, terraform** (494 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ADR-001-tailscale-md-md.md` |
| **Role** | deployment |
| **Language** | markdown |
| **Frameworks** | docker, terraform |
| **Lines** | 494 |
| **Size** | 11676 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/ADR-001-tailscale-md.md"
project: "narad"
role: deployment
language: markdown
frameworks: [docker, terraform]
lines: 456
size: 10833 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [deployment, docker, documentation, markdown, project/narad, terraform]
---

# ADR-001-tailscale-md.md

> Deployment / infrastructure config using **docker, terraform** (456 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/ADR-001-tailscale-md.md` |
| **Role** | deployment |
| **Language** | markdown |
| **Frameworks** | docker, terraform |
| **Lines** | 456 |
| **Size** | 10833 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/decisions/ADR-001-tailscale.md"
project: "vishwakarma"
role: deployment
language: markdown
frameworks: [docker, terraform]
lines: 418
size: 9977 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [deployment, docker, documentation, markdown, project/vishwakarma, terraform]
---

# ADR-001-tailscale.md

> Deployment / infrastructure config using **docker, terraform** (418 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/decisions/ADR-001-tailscale.md` |
| **Role** | deployment |
| **Language** | markdown |
| **Frameworks** | docker, terraform |
| **Lines** | 418 |
| **Size** | 9977 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Tailscale Architecture: Centralized vs Distributed

## 🎯 Two Architecture Options

### Option 1: Centralized (Your Tailscale) ⭐ RECOMMENDED
**All clients connect to YOUR Tailscale network**

```
Your Tailscale Network (tailnet)
├── Your Admin Machine
├── Client A's VM (connected as subnet router)
├── Client B's VM (connected as subnet router)
├── Client C's VM (connected as subnet router)
└── Your Management Tools
```

### Option 2: Distributed (Each Client's Tailscale)
**Each client has their own separate Tailscale network**

```
Client A Tailscale Network
└── Client A's VM

Client B Tailscale Network
└── Client B's VM

Client C Tailscale Network
└── Client C's VM
```

---

## 📊 Comparison Table

| Feature | YOUR Tailscale | Separate Tailscales |
|---------|---------------|---------------------|
| **Management** | ✅ Centralized control | ❌ Manage N networks |
| **Access** | ✅ You access all VMs | ❌ Need separate auth |
| **Monitoring** | ✅ Single dashboard | ❌ N dashboards |
| **Billing** | ✅ One subscription | ❌ N subscriptions |
| **Security** | ✅ Your ACLs control all | ⚠️ Trust client ACLs |
| **Client Control** | ⚠️ You control their VM | ✅ They control network |
| **Client Privacy** | ⚠️ You can access | ✅ Isolated networks |
| **Scalability** | ✅ Add clients easily | ❌ Setup per client |
| **Support** | ✅ You fix issues | ❌ Client self-service |
| **Cost** | ✅ $6-18/month total | ❌ $6/month × N clients |

---

## 🎯 Recommendation: YOUR Tailscale (Option 1)

### ✅ Pros

**1. Centralized Management**
- Single Tailscale admin panel
- Manage all client VMs from one place
- Unified ACL policy
- Easy to add/remove clients

**2. Better Support Experience**
- You can SSH into any client VM instantly
- Debug issues without asking for credentials
- Apply fixes across all clients at once
- Monitor all VMs from single dashboard

**3. Cost Effective**
```
Your setup: $18/month (100 devices)
vs
Per-client: $6/month × 50 clients = $300/month
```

**4. Security Control**
- You define who accesses what
- Centralized logging
- Consistent security policies
- No risk of misconfigured client tailnets

**5. Operational Efficiency**
```bash
# Access any client VM
ssh ubuntu@client-a-vm.your-tailnet.ts.net
ssh ubuntu@client-b-vm.your-tailnet.ts.net

# vs asking clients for SSH keys every time
```

**6. Easy Onboarding**
```
New client provisioning:
1. Run terraform with YOUR tailscale auth key
2. VM joins your tailnet automatically
3. You can access it immediately
4. Client gets Nextcloud URL

vs

1. Ask client to create Tailscale account
2. Wait for them to send you auth key
3. Configure terraform with their key
4. Ask for permission each time you need access
```

### ⚠️ Cons

**1. Client Privacy Concerns**
- You have SSH access to their VM
- You can see their Nextcloud data (if you wanted to)
- Some clients may not like this

**Solution:** 
- Be transparent in ToS/agreement
- Use ACLs to limit your access to management only
- Audit logs for transparency

**2. Single Point of Failure**
- If your Tailscale account has issues, all clients affected

**Solution:**
- Tailscale has 99.99% uptime SLA
- VMs still work, just can't manage them temporarily
- Have backup SSH keys configured

---

## 🏗️ Recommended Architecture

### Your Tailscale Network Structure

```
your-company.tailnet.ts.net
│
├── Admin Tier (Your devices)
│   ├── your-laptop.tailnet.ts.net
│   ├── your-desktop.tailnet.ts.net
│   └── management-vm.tailnet.ts.net
│
├── Client VMs (Provisioned VMs)
│   ├── client-a.tailnet.ts.net (Nextcloud)
│   ├── client-b.tailnet.ts.net (Nextcloud)
│   ├── client-c.tailnet.ts.net (Nextcloud)
│   └── ...
│
└── Monitoring/Tools
    └── monitoring-vm.tailnet.ts.net
```

### ACL Policy (Access Control)

```jsonc
// tailscale-acl.json
{
  "acls": [
    // You (admin) can access everything
    {
      "action": "accept",
      "src": ["tag:admin"],
      "dst": ["*:*"]
    },
    
    // Client VMs can access internet but not each other
    {
      "action": "accept",
      "src": ["tag:client-vm"],
      "dst": ["autogroup:internet:*"]
    },
    
    // Block client VMs from accessing each other
    {
      "action": "deny",
      "src": ["tag:client-vm"],
      "dst": ["tag:client-vm:*"]
    },
    
    // Allow monitoring from your monitoring VM
    {
      "action": "accept",
      "src": ["tag:monitoring"],
      "dst": ["tag:client-vm:22,443,80"]
    }
  ],
  
  "tagOwners": {
    "tag:admin": ["your-email@example.com"],
    "tag:client-vm": ["your-email@example.com"],
    "tag:monitoring": ["your-email@example.com"]
  }
}
```

---

## 🔧 Implementation

### Current Setup (Using Client Tailscales)

```hcl
# terraform/main.tf
variable "tailscale_auth_key" {
  description = "Client's Tailscale auth key"
  type        = string
  sensitive   = true
}
```

### Recommended Setup (Using YOUR Tailscale)

```hcl
# terraform/main.tf
# Use YOUR Tailscale auth key for ALL clients
variable "tailscale_auth_key" {
  description = "Your centralized Tailscale auth key"
  type        = string
  sensitive   = true
  default     = "" # Set in Terraform Cloud workspace
}

# Tag each VM with client identifier
resource "null_resource" "tailscale_setup" {
  provisioner "remote-exec" {
    inline = [
      "curl -fsSL https://tailscale.com/install.sh | sh",
      "tailscale up --authkey=${var.tailscale_auth_key} --hostname=${var.client_name}-vm --advertise-tags=tag:client-vm"
    ]
  }
}
```

### Generate Auth Keys

```bash
# In Tailscale admin console:
# Settings → Keys → Generate auth key

Options:
✅ Reusable (check this!)
✅ Ephemeral (unchecked - VMs are permanent)
✅ Tags: tag:client-vm
⏱️ Expiry: Never (or 90 days)
```

**Store in Terraform Cloud:**
```
Workspace: client-provisioning
Variable: tailscale_auth_key
Value: tskey-auth-xxxxx
Sensitive: Yes ✅
```

---

## 🎯 Migration Path (If Already Using Client Tailscales)

### Option A: Grandfather Existing, Change Going Forward
```
Existing clients: Keep on their own Tailscales
New clients: Use your Tailscale
Gradually migrate old clients during renewals
```

### Option B: Migrate All at Once
```
1. Get permission from clients
2. Remove their Tailscale agents
3. Reinstall with your auth key
4. Update DNS/documentation
```

### Option C: Hybrid (Not Recommended)
```
Maintain both architectures
More complex, but gives flexibility
```

---

## 📋 Decision Framework

### Use YOUR Tailscale if:
✅ You provide managed service (you maintain VMs)
✅ You need to troubleshoot/support clients
✅ You want centralized monitoring
✅ Cost efficiency matters
✅ You have 10+ clients

### Use Client's Tailscale if:
⚠️ Clients are highly privacy-sensitive
⚠️ Clients want full network control
⚠️ Regulatory/compliance requires isolation
⚠️ You have < 5 clients
⚠️ You offer "self-managed" tier

---

## 💰 Cost Analysis

### Your Tailscale (Recommended)

**Tailscale Personal (Free):**
- Up to 20 devices
- Perfect for first 20 clients
- Cost: $0/month

**Tailscale Personal Pro ($6/month):**
- Up to 100 devices
- First 80+ clients
- Cost: $6/month total

**Tailscale Premium ($18/month):**
- Unlimited devices
- Advanced ACLs
- Cost: $18/month total

**Total for 50 clients: $18/month** ✅

---

### Separate Tailscales (Not Recommended)

**Each client needs Personal Pro ($6/month):**
- 50 clients × $6 = $300/month
- You need separate credentials for each
- Management nightmare

**Total for 50 clients: $300/month** ❌

---

## 🔐 Security Considerations

### With YOUR Tailscale

**Advantages:**
- You control all access
- Consistent security policies
- Centralized audit logs
- Can revoke access immediately

**Address Privacy Concerns:**
```
Terms of Service:
"Your VM is connected to our management network for:
- Automated updates and monitoring
- Technical support and troubleshooting  
- Backup management
- Security patching

We do not access your data without permission.
Access logs are available on request."
```

**Technical Controls:**
- ACLs prevent you from accessing client data ports
- Only allow SSH on port 22 for management
- All access logged in Tailscale audit log
- Clients can review access logs anytime

---

## 🎯 Final Recommendation

**Use YOUR Tailscale for all clients**

### Implementation Checklist:

```
✅ Create Tailscale account (if not exist)
✅ Generate reusable auth key with tag:client-vm
✅ Store in Terraform Cloud (sensitive)
✅ Update terraform to use YOUR key
✅ Configure ACL policy for security
✅ Add to Terms of Service / SLA
✅ Document for clients
✅ Test with first client
✅ Roll out to all new clients
```

### Update Terraform Cloud Variable:

```
Workspace: client-provisioning
Variable: tailscale_auth_key
Value: tskey-auth-YOUR-KEY-HERE (from your Tailscale)
Sensitive: Yes
Description: Your centralized Tailscale auth key for all client VMs
```

### Result:

```
1. ✅ All client VMs auto-join your Tailscale
2. ✅ You can access any VM instantly
3. ✅ Centralized management dashboard
4. ✅ One subscription ($6-18/month total)
5. ✅ Better support experience
6. ✅ Easier onboarding
```

---

## 🚀 Next Steps

1. **Decision:** Use YOUR Tailscale ✅
2. **Create auth key:** Tailscale admin → Keys → Generate
3. **Update Terraform:** Replace client tailscale_auth_key with yours
4. **Test:** Provision one VM to verify
5. **Deploy:** Roll out to production
6. **Document:** Update client onboarding docs

**Time to implement:** 30 minutes
**Cost savings:** ~$282/month for 50 clients
**Management improvement:** 10x easier

---

**Recommendation: Go with YOUR Tailscale!** 🎯

The benefits (cost, management, support) far outweigh the cons (privacy concerns, which can be addressed with transparency and ACLs).

```

```

```

```

```

```

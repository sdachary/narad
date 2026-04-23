# Karma + Vishwakarma Integration Plan

> Updated April 2026 - Using Independent Platforms Architecture

**Key Change**: Platforms now stay independent. Only summary data syncs to Chitragupta for tax.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Phased Implementation](#3-phased-implementation)
4. [Indian Government Compliance](#4-indian-government-compliance)
5. [Payment Strategy](#5-payment-strategy)
6. [Trust Model](#6-trust-model)
7. [Technical Specifications](#7-technical-specifications)
8. [Subagent Verification Framework](#8-subagent-verification-framework)
9. [Risk Management](#9-risk-management)
10. [Success Metrics](#10-success-metrics)
11. [Appendices](#11-appendices)

---

## 1. Executive Summary

### 1.1 Vision

Build a **self-owned compute marketplace** where:
- Individuals share their computational resources for tasks
- Karma handles marketplace + earnings distribution
- Vishwakarma orchestrates compute across nodes
- Zero external cloud dependency (long-term)
- Fully compliant with Indian government regulations

### 1.2 Timeline Overview

| Phase | Timeline | Focus | Dependency | Target |
|-------|----------|-------|------------|--------|
| **Phase 1** | Months 1-3 | Karma on Golem/Akash | External | MVP launch |
| **Phase 2** | Months 4-6 | Karma↔Vishwakarma Bridge | Hybrid | Hybrid network |
| **Phase 3** | Months 7-12 | Self-owned Compute | Zero external | Full independence |

### 1.3 Key Metrics Targets

| Metric | Phase 1 | Phase 2 | Phase 3 |
|-------|---------|---------|---------|
| Active Contributors | 50 | 200 | 500+ |
| Tasks Completed | 1,000 | 10,000 | 50,000+ |
| Monthly Revenue (INR) | ₹50K | ₹5L | ₹25L |
| Payouts Processed | ₹25K | ₹2.5L | ₹15L |

---

## 2. Architecture Overview

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KARMA PLATFORM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────┐  │
│  │  User      │   │  Task     │   │ Earnings  │   │ Payment  │  │
│  │  Portal   │   │  Queue    │   │ Engine   │   │ Gateway │  │
│  └─────────────┘   └─────────────┘   └─────────────┘   └──────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                         VISHWAKARMA ORCHESTRATOR                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────┐  │
│  │  Node     │   │  Task     │   │ Health    │   │ Trust   │  │
│  │  Manager  │   │  Distributor│  │ Monitor  │   │ Score   │  │
│  └─────────────┘   └─────────────┘   └─────────────┘   └──────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                         COMPUTE RESOURCES                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐                │
│  │  Golem    │   │  Akash     │   │  Self-    │                │
│  │  Network  │   │  Network   │   │  Owned    │                │
│  └─────────────┘   └─────────────┘   └─────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
User → Task → Karma Queue → Vishwakarma → Compute Node → Result → Verification → Payment
           │                                    │
           └──────────── Earnings Calculation ──────┘
```

---

## 3. Phased Implementation

### 3.1 Phase 1: External Network Integration (Months 1-3)

#### Objectives
- Launch Karma with external compute (Golem/Akash)
- Establish payment infrastructure
- Onboard initial 50 contributors
- Validate demand/use cases

#### Deliverables

| Week | Deliverable | Description |
|------|------------|-------------|
| 1-2 | Karma Core + Golem SDK | Basic task execution on Golem |
| 3-4 | Akash Integration | Alternative compute provider |
| 5-6 | Payment Gateway | UPI + Wallet integration |
| 7-8 | Contributor Portal | Registration + Node setup |
| 9-10 | Earnings Engine | Commission + payout calculation |
| 11-12 | Beta Launch | 50 users, 1000 tasks |

#### Technical Implementation

```python
# Phase 1: karma/backend/services/compute_providers.py

from enum import Enum
from typing import Protocol

class ComputeProvider(Enum):
    GOLEM = "golem"
    AKASH = "akash"
    SELF_OWNED = "self_owned"

class ComputeProvider(Protocol):
    """Interface for compute providers."""
    
    async def submit_task(self, task: dict) -> str:
        """Submit task, return task_id."""
        ...
    
    async def get_result(self, task_id: str) -> dict:
        """Get task result."""
        ...
    
    async def estimate_cost(self, resources: dict) -> float:
        """Estimate cost in INR."""
        ...

class GolemProvider:
    """Golem Network provider."""
    
    def __init__(self, config: dict):
        self.config = config
        self.yagna = None
    
    async def submit_task(self, task: dict) -> str:
        # Use golem-js SDK
        # Map task to Golem demand
        # Return agreement_id
        ...
    
    async def get_result(self, task_id: str) -> dict:
        # Poll for result
        # Decrypt and return
        ...
    
    async def estimate_cost(self, resources: dict) -> float:
        # Calculate based on pricing model
        # maxStartPrice + (cpuPrice * hours) + (envPrice * hours)
        ...

class AkashProvider:
    """Akash Network provider."""
    
    def __init__(self, config: dict):
        self.api_key = config["api_key"]
        self.base_url = "https://console-api.akash.network"
    
    async def submit_task(self, task: dict) -> str:
        # Create SDL from task
        # Deploy on Akash
        # Return dseq
        ...
    
    async def get_result(self, task_id: str) -> dict:
        # Get deployment status
        # Fetch logs/result
        ...
    
    async def estimate_cost(self, resources: dict) -> float:
        # Calculate based on resources
        # Deposit required: resources * pricing * duration
        ...
```

#### User Flow (Phase 1)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Phase 1: User Journey                                        │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Register (Phone + Email + UPI)                           │
│    ↓                                                        │
│ 2. Submit Task (Select: compute type + urgency)              │
│    ↓                                                        │
│ 3. Payment (UPI/Bank Transfer → Escrow)                     │
│    ↓                                                        │
│ 4. Task Assigned to Golem/Akash                             │
│    ↓                                                        │
│ 5. Execution + Verification                                  │
│    ↓                                                        │
│ 6. Release Funds (Task Complete)                            │
│    ↓                                                        │
│ 7. Contributor Gets: (Amount - Commission)                │
│         Platform Gets: Commission                          │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Phase 2: Hybrid Network (Months 4-6)

#### Objectives
- Bridge Karma with Vishwakarma
- Onboard top contributors as verified nodes
- Implement trust-based node selection
- Expand to 200 contributors

#### Deliverables

| Week | Deliverable | Description |
|------|------------|-------------|
| 13-14 | Vishwakarma Node Agent | Lightweight node daemon |
| 15-16 | Karma↔Vishwakarma API | Internal communication |
| 17-18 | Trust Score Integration | Node reputation |
| 19-20 | Hybrid Routing | External + Internal |
| 21-22 | Verified Contributor Onboarding | Top Sharers → Vishwakarma |
| 23-24 | Scaling | 200 contributors |

#### Architecture (Phase 2)

```python
# Phase 2: karma/backend/services/hybrid_router.py

from typing import Optional
import random

class HybridRouter:
    """Routes tasks between external providers and self-owned nodes."""
    
    def __init__(self, config: dict):
        self.external_providers = ExternalProviders(config)
        self.internal_nodes = InternalNodeManager(config)
        self.trust_engine = TrustEngine(config)
    
    async def route_task(self, task: dict) -> dict:
        """
        Route task to best available compute source.
        
        Priority:
        1. Verified internal nodes (highest trust)
        2. Internal nodes (based on trust score)
        3. External providers (fallback)
        """
        # Check available internal nodes
        internal_nodes = await self.internal_nodes.get_available(
            requirements=task["resources"]
        )
        
        if internal_nodes:
            # Sort by trust score
            sorted_nodes = sorted(
                internal_nodes, 
                key=lambda n: self.trust_engine.get_score(n),
                reverse=True
            )
            
            # If top node has trust > 0.8, use internal
            if sorted_nodes[0]["trust_score"] >= 0.8:
                return {
                    "source": "internal",
                    "node": sorted_nodes[0]
                }
        
        # Fallback to external
        provider = await self.external_providers.select(
            task["resources"],
            task.get("budget", 0)
        )
        
        return {
            "source": "external",
            "provider": provider
        }
```

#### Node Categories (Phase 2)

| Category | Trust Score | Access | Description |
|---------|------------|--------|-------------|
| **Verified** | 95-100 | Priority | Top contributors, OCI VMs |
| **Trusted** | 80-94 | Standard | Regular contributors |
| **New** | 0-79 | Limited | New onboarding |

### 3.3 Phase 3: Self-Owned Compute (Months 7-12)

#### Objectives
- Full independence from external providers
- Scale to 500+ self-owned nodes
- Automated node onboarding
- Zero-dependency compute network

#### Deliverables

| Month | Deliverable | Description |
|-------|------------|-------------|
| 7-8 | Node Auto-Provision | Self-service VM setup |
| 9-10 | Resource Pool | Centralized compute pool |
| 11-12 | Full Launch | 500+ nodes |

#### Target Architecture (Phase 3)

```
┌────────────────────────────────────────────────────────────��────────┐
│ Phase 3: Self-Owned Network                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              KARMA MARKETPLACE                        │  │
│   │  • Task Queue      • Earnings     • Routing          │  │
│   └─────────────────────────────────────────────────────┘  │
│                            │                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │           VISHWAKARMA ORCHESTRATOR                   │  │
│   │  • Node Discovery  • Task Distribution  • Health   │  │
│   └─────────────────────────────────────────────────────┘  │
│                            │                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              SELF-OWNED NODES                        │  │
│   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │  │
│   │  │ Node 1 │ │ Node 2 │ │ Node N │ │ GPU    │    │  │
│   │  │  VM    │ │  VM    │ │  VM    │ │ Node  │    │  │
│   │  └────────┘ └────────┘ └────────┘ └────────┘    │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Indian Government Compliance

### 4.1 Applicable Regulations

| Regulation | Applicability | Action Required |
|------------|--------------|----------------|
| **GST (18%)** | IT Services | Register, charge 18%, file returns |
| **TDS (10%)** | Freelancer payouts | Deduct TDS on payments > ₹30K |
| **RBI Guidelines** | UPI/Digital payments | 2FA authentication |
| **Data Protection (DPDP Act)** | User data | Consent, security measures |
| **KYC** | User verification | Aadhaar/Phone verification |

### 4.2 GST Compliance

#### Registration Requirements
- **Threshold**: ₹20 lakh annual turnover (₹10 lakh in special states)
- **OIDAR Services**: Register regardless of turnover if serving overseas

#### Implementation

```python
# karma/backend/services/gst_compliance.py

from enum import Enum
from dataclasses import dataclass

class GSTRegistration(Enum):
    UNREGISTERED = "unregistered"
    REGISTERED = "registered"
    COMPOSITION = "composition"
    OIDAR = "oidar"

@dataclass
class GSTConfig:
    registration_type: GSTRegistration
    gstin: str = ""
    rate: float = 0.18  # 18% for IT services
    
    # SAC codes for compute services
    SAC_COMPUTE = "998313"  # IT services
    SAC_CLOUD = "998315"   # Cloud/hosting

class GSTEngine:
    """GST calculation and compliance."""
    
    def __init__(self, config: GSTConfig):
        self.config = config
    
    def calculate_gst(self, base_amount: float) -> dict:
        """Calculate GST inclusive breakdown."""
        cgst = base_amount * 0.09  # 9% CGST
        sgst = base_amount * 0.09  # 9% SGST
        
        return {
            "base_amount": base_amount,
            "cgst": cgst,
            "sgst": sgst,
            "igst": 0,  # Intra-state
            "total": base_amount + cgst + sgst,
            "sac_code": self.config.SAC_COMPUTE
        }
    
    def calculate_igst(self, base_amount: float, is_export: bool = False) -> dict:
        """Calculate IGST for exports (zero-rated)."""
        if is_export:
            return {
                "base_amount": base_amount,
                "igst": 0,  # Zero-rated export
                "total": base_amount,
                "export": True,
                "lut_filed": True  # Letter of Undertaking
            }
        
        igst = base_amount * 0.18
        return {
            "base_amount": base_amount,
            "igst": igst,
            "total": base_amount + igst,
            "export": False
        }
    
    def generate_invoice(self, task: dict, earnings: dict) -> dict:
        """Generate GST-compliant invoice."""
        gst_breakup = self.calculate_gst(earnings["gross_amount"])
        
        return {
            "invoice_number": f"INV-{task['id']:06d}",
            "date": task["completed_at"],
            "gstin": self.config.gstin,
            "recipient": {
                "name": earnings["user_name"],
                "gstin": earnings.get("user_gstin", "")
            },
            "item": {
                "description": f"Compute task: {task['task_type']}",
                "sac_code": self.config.SAC_COMPUTE,
                "quantity": 1,
                "rate": earnings["gross_amount"],
                "amount": earnings["gross_amount"]
            },
            "tax_breakup": gst_breakup,
            "total_amount": earnings["gross_amount"] + gst_breakup["total"],
            "bank_details": {
                "account_name": "Karma Compute Platform",
                "account_number": "XXXXXXXXXX",
                "ifsc": "XXXXXXXXX"
            }
        }
```

### 4.3 TDS Compliance

#### Requirements (Section 194C / Section 194J)
- **Threshold**: ₹30,000 per transaction per FY
- **Rate**: 10% (individual), 10% (HUF), 20% (others) for professional services

#### Implementation

```python
# karma/backend/services/tds_compliance.py

from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class TDSConfig:
    threshold_amount: float = 30000  # ₹30K
    tds_rate_individual: float = 0.10  # 10%
    tds_rate_corporate: float = 0.20  # 20%

class TDSEngine:
    """TDS calculation and compliance."""
    
    def __init__(self, config: TDSConfig):
        self.config = config
        self.user_accumulated = {}  # user_id -> accumulated_payments
    
    def calculate_tds(
        self, 
        user_id: str, 
        amount: float, 
        user_category: str
    ) -> dict:
        """Calculate TDS if above threshold."""
        # Track accumulated payments
        if user_id not in self.user_accumulated:
            self.user_accumulated[user_id] = 0
        
        self.user_accumulated[user_id] += amount
        
        # Check threshold
        if self.user_accumulated[user_id] <= self.config.threshold_amount:
            return {
                "tds_applicable": False,
                "tds_amount": 0,
                "reason": "Below threshold"
            }
        
        # Apply TDS
        rate = (
            self.config.tds_rate_individual 
            if user_category in ["individual", "HUF"]
            else self.config.tds_rate_corporate
        )
        
        tds_amount = amount * rate
        
        return {
            "tds_applicable": True,
            "tds_amount": tds_amount,
            "rate": rate,
            "user_category": user_category,
            "form": "27A",  # TDS certificate form
            "section": "194J"  # Professional services
        }
    
    def generate_form_16A(
        self, 
        user_id: str, 
        user_details: dict,
        fy: str
    ) -> dict:
        """Generate TDS Certificate (Form 16A)."""
        total_amount = self.user_accumulated.get(user_id, 0)
        total_tds = sum([
            self.calculate_tds(user_id, amt, user_details.get("category", "individual"))["tds_amount"]
            for amt in [total_amount]  # Simplified
        ])
        
        return {
            "form_type": "16A",
            "financial_year": fy,
            "quarter": f"Q{(datetime.now().month - 1) // 3 + 1}",
            "deductee": {
                "name": user_details["name"],
                "pan": user_details["pan"],
                "address": user_details["address"],
                "category": user_details["category"]
            },
            "deductor": {
                "name": "Karma Compute Platform",
                "tan": "XXXXX1234A"
            },
            "income_paid": total_amount,
            "tax_deducted": total_tds,
            "date": datetime.now().isoformat()
        }
```

### 4.4 Payment Gateway Compliance

#### RBI Guidelines (2025)
- **2FA Required**: All digital payment transactions
- **KYC Required**: UPI transactions need verification
- **Escrow**: Funds held in escrow until task completion

#### Implementation

```python
# karma/backend/services/payment_gateway.py

from enum import Enum
from dataclasses import dataclass

class PaymentMethod(Enum):
    UPI = "upi"
    BANK_TRANSFER = "bank_transfer"
    CRYPTO = "crypto"  # For international

class PaymentStatus(Enum):
    PENDING = "pending"
    ESCROWED = "escrowed"
    RELEASED = "released"
    FAILED = "failed"
    REFUNDED = "refunded"

@dataclass
class PaymentConfig:
    escrow_bank: str = "HDFC Bank"
    escrow_account: str = "XXXXXXXXXXXX"
    upi_id: "karma@oksbi"
    min_payout: float = 100  # ₹100 minimum
    payout_frequency: str = "daily"  # daily/weekly/monthly

class PaymentGateway:
    """RBI-compliant payment gateway."""
    
    def __init__(self, config: PaymentConfig):
        self.config = config
        self.escrow_balance = 0
    
    async def create_escrow(self, user_id: str, amount: float) -> dict:
        """Create escrow for task payment."""
        # 2FA verification required (handled by payment provider)
        escrow_id = f"ESC-{user_id}-{datetime.now().timestamp()}"
        
        self.escrow_balance += amount
        
        return {
            "escrow_id": escrow_id,
            "user_id": user_id,
            "amount": amount,
            "status": PaymentStatus.ESCROWED.value,
            "created_at": datetime.now().isoformat()
        }
    
    async def verify_2fa(self, transaction_id: str, otp: str) -> bool:
        """Verify 2FA OTP."""
        # Integrate with UPI provider (PhonePe/Razorpay)
        # Return verification status
        ...
    
    async def release_payment(
        self, 
        escrow_id: str, 
        user_upi: str,
        amount: float,
        tds_amount: float = 0
    ) -> dict:
        """Release payment to contributor."""
        net_amount = amount - tds_amount
        
        if net_amount < self.config.min_payout:
            return {
                "status": "below_minimum",
                "reason": f"Minimum payout is ₹{self.config.min_payout}"
            }
        
        # Transfer via UPI
        transfer = await self._transfer_via_upi(
            user_upi, 
            net_amount
        )
        
        self.escrow_balance -= amount
        
        return {
            "escrow_id": escrow_id,
            "amount_transferred": net_amount,
            "tds_deducted": tds_amount,
            "status": PaymentStatus.RELEASED.value,
            "reference": transfer["reference"]
        }
    
    async def _transfer_via_upi(self, upi_id: str, amount: float) -> dict:
        """Transfer via UPI."""
        # Integrate with payment provider
        ...
```

### 4.5 Data Protection (DPDP Act)

#### Requirements
- **Consent**: Explicit consent for data collection
- **Purpose**: Data used only for stated purpose
- **Security**: Encryption of personal data
- **Retention**: Data deleted after purpose fulfilled

#### Implementation

```python
# karma/backend/services/data_protection.py

from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass
class DataConsent:
    user_id: str
    consent_type: str  # "task_submission", "payout", "marketing"
    granted: bool
    timestamp: datetime
    purpose: str
    expiry_days: int = 365

class DataProtection:
    """DPDP Act compliance."""
    
    def __init__(self):
        self.consents = {}  # user_id -> [consents]
    
    async def request_consent(
        self, 
        user_id: str, 
        consent_type: str,
        purpose: str
    ) -> dict:
        """Request user consent."""
        consent = DataConsent(
            user_id=user_id,
            consent_type=consent_type,
            granted=False,
            timestamp=datetime.now(),
            purpose=purpose
        )
        
        return {
            "consent_id": f"CONSENT-{user_id}-{consent_type}",
            "consent_required": True,
            "purpose": purpose,
            "data_types": self._get_data_types(consent_type)
        }
    
    async def grant_consent(
        self, 
        user_id: str, 
        consent_id: str,
        signature: str
    ) -> dict:
        """Grant consent (digital signature)."""
        # Verify signature
        # Store consent
        ...
    
    def _get_data_types(self, consent_type: str) -> list:
        """Get data types required for consent type."""
        data_types = {
            "task_submission": ["email", "phone", "task_data"],
            "payout": ["bank_details", "upi_id", "pan"],
            "node_metrics": ["system_info", "performance"]
        }
        return data_types.get(consent_type, [])
```

---

## 5. Payment Strategy

### 5.1 Revenue Model

| Source | Rate | Description |
|--------|------|-------------|
| **Platform Commission** | 20% | From contributor earnings |
| **Task Fee** | 5% | On top of task cost |
| **Premium Tasks** | Variable | Higher markup for GPU/AI |

### 5.2 Cost Structure

```
┌──────────────��─��────────────────────────────────────────────────────┐
│ Payment Flow (Per Task)                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                             │
│   Task Price: ₹1000                                         │
│          │                                                  │
│   ├── Platform Fee (5%): ₹50                               │
│   │       Used for: Platform maintenance, support         │
│   │                                                  │
│   └── Net to Contributor: ₹950                              │
│         │                                               │
│         ├── TDS (10%): ₹95*                               │
│         │    *If annual > ₹30K                              │
│         │                                               │
│         └── After TDS: ₹855                                  │
│              │                                           │
│              └── GST (18% included in pricing)              │
│                   Note: Contributor responsible for GST filing  │
│                   if registered                            │
└────────────────────────────────────────────────────────────┘
```

### 5.3 Payout Options

| Method | Processing Time | Fee | Availability |
|--------|---------------|-----|--------------|
| **UPI** | Instant | ₹0 | India only |
| **Bank Transfer** | 1-2 days | ₹25 | India |
| **Crypto (USDT)** | 1-24 hours | Network fee | Global |

### 5.4 Payout Schedule

| User Tier | Minimum Payout | Frequency |
|-----------|----------------|-----------|
| **New** | ₹500 | Weekly |
| **Regular** | ₹200 | Daily |
| **Verified** | ₹100 | Daily |

### 5.5 Commission Calculator

```python
# karma/backend/services/commission_calculator.py

from dataclasses import dataclass

@dataclass
class CommissionConfig:
    platform_fee_percent: float = 0.05  # 5% on task price
    commission_percent: float = 0.20  # 20% on contributor earnings
    gst_rate: float = 0.18  # 18% GST

class CommissionCalculator:
    """Calculate platform revenue."""
    
    def __init__(self, config: CommissionConfig):
        self.config = config
    
    def calculate(
        self, 
        task_price: float, 
        execution_time: float,
        cpu_cores: int
    ) -> dict:
        """Calculate complete fee breakdown."""
        # Platform fee (5% of task price)
        platform_fee = task_price * self.config.platform_fee_percent
        
        # Contributor earnings base
        contributor_share = task_price - platform_fee
        
        # Platform commission (20% of contributor share)
        commission = contributor_share * self.config.commission_percent
        
        # Contributor receives
        net_contributor = contributor_share - commission
        
        # Platform revenue (platform fee + commission)
        platform_revenue = platform_fee + commission
        
        # GST on platform revenue
        gst_on_fee = platform_fee * self.config.gst_rate
        gst_on_commission = commission * self.config.gst_rate
        total_gst = gst_on_fee + gst_on_commission
        
        return {
            "task_price": task_price,
            "breakdown": {
                "platform_fee": platform_fee,
                "commission": commission,
                "platform_revenue": platform_revenue,
                "gst_payable": total_gst
            },
            "contributor": {
                "gross_earnings": contributor_share,
                "net_earnings": net_contributor,
                "tds_applicable": net_contributor > 30000
            }
        }
```

### 5.6 Payment Implementation

```python
# karma/backend/routes/payments.py

from fastapi import APIRouter, Depends
from ..schemas import PaymentRequest, PaymentResponse

router = APIRouter()

@router.post("/create-escrow")
async def create_escrow(
    request: PaymentRequest,
    current_user: User = Depends(get_current_user)
):
    """Create payment escrow for task."""
    # 1. Verify 2FA
    # 2. Create escrow
    # 3. Return escrow details
    ...

@router.post("/release")
async def release_payment(
    escrow_id: str,
    current_user: User = Depends(get_current_user)
):
    """Release payment after task completion."""
    # 1. Verify task completed
    # 2. Calculate TDS if applicable
    # 3. Transfer to contributor
    # 4. Generate invoice
    ...
```

---

## 6. Trust Model

### 6.1 Trust Score Components

| Component | Weight | Description |
|-----------|--------|-------------|
| **Task Completion** | 30% | Successful task completion rate |
| **Response Time** | 20% | Average response time |
| **Rating** | 25% | User satisfaction rating |
| **Uptime** | 15% | Node availability |
| **Verification** | 10% | KYC completion |

### 6.2 Trust Score Calculation

```python
# karma/backend/services/trust_engine.py

from dataclasses import dataclass
from datetime import datetime

@dataclass
class TrustConfig:
    weights: dict = None
    
    def __post_init__(self):
        self.weights = {
            "completion": 0.30,
            "response_time": 0.20,
            "rating": 0.25,
            "uptime": 0.15,
            "verification": 0.10
        }

class TrustEngine:
    """Calculate trust scores for nodes."""
    
    def __init__(self, config: TrustConfig):
        self.config = config
    
    async def calculate_score(self, node_id: str) -> float:
        """Calculate trust score (0-100)."""
        # Fetch node metrics
        metrics = await self.get_node_metrics(node_id)
        
        # Calculate components
        completion = self._calc_completion(metrics) * self.config.weights["completion"]
        response = self._calc_response_time(metrics) * self.config.weights["response_time"]
        rating = self._calc_rating(metrics) * self.config.weights["rating"]
        uptime = self._calc_uptime(metrics) * self.config.weights["uptime"]
        verification = self._calc_verification(metrics) * self.config.weights["verification"]
        
        total = completion + response + rating + uptime + verification
        
        # Clamp to 0-100
        return min(100, max(0, total * 100))
    
    def _calc_completion(self, metrics: dict) -> float:
        """Completion rate (0-1)."""
        total = metrics.get("total_tasks", 1)
        success = metrics.get("successful_tasks", 0)
        return success / total if total > 0 else 0
    
    def _calc_response_time(self, metrics: dict) -> float:
        """Response time score (0-1, lower is better)."""
        avg_time = metrics.get("avg_response_seconds", 60)
        # 0 for >60s, 1 for instant
        return max(0, 1 - (avg_time / 60))
```

### 6.3 Trust-Based Access

| Trust Level | Score Range | Access |
|------------|------------|--------|
| **Limited** | 0-49 | Task queue only |
| **Standard** | 50-79 | Priority queue |
| **Trusted** | 80-94 | Premium tasks |
| **Verified** | 95-100 | Priority + Early access |

---

## 7. Technical Specifications

### 7.1 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tasks/create` | POST | Create new task |
| `/tasks/{id}` | GET | Get task status |
| `/nodes/register` | POST | Register node |
| `/nodes/{id}/heartbeat` | POST | Node heartbeat |
| `/earnings/calculate` | POST | Calculate earnings |
| `/payments/escrow` | POST | Create escrow |
| `/payments/release` | POST | Release payment |
| `/trust/score` | GET | Get trust score |

### 7.2 Database Schema

```python
# karma/backend/models.py (Extended)

class User(Base):
    """Extended user model with compliance fields."""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20), unique=True)  # For UPI
    upi_id = Column(String(50))  # UPI handle
    pan = Column(String(10))  # PAN for TDS
    gstin = Column(String(15))  # GSTIN
    kyc_status = Column(String(20), default="pending")
    trust_score = Column(Float, default=0)
    total_earnings = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Node(Base):
    """Extended node model."""
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    node_type = Column(String(20))  # "golem", "akash", "self"
    trust_score = Column(Float, default=50)
    total_tasks = Column(Integer, default=0)
    successful_tasks = Column(Integer, default=0)
    avg_response_time = Column(Float, default=60)
    uptime_percent = Column(Float, default=0)
    is_verified = Column(Boolean, default=False)
    vishwakarma_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 7.3 Task Queue Integration

```python
# karma/backend/services/task_queue.py

import asyncio
from enum import Enum
from dataclasses import dataclass

class TaskPriority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    URGENT = 4

@dataclass
class Task:
    id: int
    task_type: str
    payload: dict
    priority: TaskPriority = TaskPriority.NORMAL
    required_trust: int = 0
    max_execution_time: int = 3600

class TaskQueue:
    """Priority task queue with compute routing."""
    
    def __init__(self):
        self.queues = {
            TaskPriority.LOW: asyncio.PriorityQueue(),
            TaskPriority.NORMAL: asyncio.PriorityQueue(),
            TaskPriority.HIGH: asyncio.PriorityQueue(),
            TaskPriority.URGENT: asyncio.PriorityQueue()
        }
        self.hybrid_router = None
    
    async def enqueue(self, task: Task):
        """Add task to queue."""
        queue = self.queues[task.priority]
        await queue.put((self._priority_value(task), task))
    
    async def dequeue(self, node_trust: int = 50) -> Task:
        """Get next task matching node trust."""
        # Try high priority first
        for priority in [TaskPriority.URGENT, TaskPriority.HIGH, 
                       TaskPriority.NORMAL, TaskPriority.LOW]:
            queue = self.queues[priority]
            
            while not queue.empty():
                _, task = queue.get_nowait()
                
                if task.required_trust <= node_trust:
                    return task
                
                # Re-queue with lower priority
                await self.queues[priority].put((self._priority_value(task), task))
        
        return None
    
    def _priority_value(self, task: Task) -> int:
        """Calculate priority value for sorting."""
        return (task.priority.value * 1000) + (100 - task.required_trust)
```

---

## 8. Subagent Verification Framework

### 8.1 Verification Architecture

```
┌───────────────────────────────────────────────────────────────��─────┐
│                    VERIFICATION SUBAGENTS                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │ Compliance  │   │  Security   │   │   Quality   │        │
│  │  Checker   │   │  Auditor   │   │   Reviewer │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐        │
│  │   Payment   │   │   Legal     │   │  Economic  │        │
│  │ Validator  │   │  Reviewer   │   │   Analyst  │        │
│  └──────────────┘   └──────────────┘   └──────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Subagent Definitions

```yaml
# .agents/karma_verification/agents.yaml

subagents:
  - name: compliance_checker
    role: Verify regulatory compliance
    tools:
      - gst_validator
      - tds_calculator
      - kyc_verifier
    trigger: 
      - task_created
      - payout_requested
    
  - name: security_auditor
    role: Security audit and vulnerability scanning
    tools:
      - code_scanner
      - encryption_verifier
      - access_control_checker
    trigger:
      - node_registered
      - weekly_audit
    
  - name: quality_reviewer
    role: Review task completion quality
    tools:
      - result_verifier
      - feedback_analyzer
    trigger:
      - task_completed
      
  - name: payment_validator
    role: Validate payment compliance
    tools:
      - escrow_checker
      - tds_calculator
      - upi_verifier
    trigger:
      - payout_requested
      
  - name: legal_reviewer
    role: Review legal compliance
    tools:
      - contract_validator
      - dpdp_compliance_checker
    trigger:
      - user_registered
      - quarterly_review
      
  - name: economic_analyst
    role: Analyze platform economics
    tools:
      - revenue_calculator
      - payout_analyzer
      - market_analysis
    trigger:
      - monthly_report
```

### 8.3 Verification Workflows

```python
# karma/agent/verification/workflows.py

from enum import Enum
from dataclasses import dataclass
from typing import Callable

class VerificationTrigger(Enum):
    TASK_CREATED = "task_created"
    NODE_REGISTERED = "node_registered"
    TASK_COMPLETED = "task_completed"
    PAYOUT_REQUESTED = "payout_requested"
    USER_REGISTERED = "user_registered"
    WEEKLY_AUDIT = "weekly_audit"
    MONTHLY_REPORT = "monthly_report"

@dataclass
class VerificationResult:
    passed: bool
    issues: list
    recommendations: list
    subagent: str

class VerificationWorkflow:
    """Base verification workflow."""
    
    def __init__(self, trigger: VerificationTrigger):
        self.trigger = trigger
        self.subagents = []
    
    async def run(self, context: dict) -> VerificationResult:
        """Run verification."""
        results = []
        
        for subagent in self.subagents:
            result = await subagent.verify(context)
            results.append(result)
        
        # Aggregate results
        passed = all(r.passed for r in results)
        issues = [r.issues for r in results]
        recommendations = [r.recommendations for r in results]
        
        return VerificationResult(
            passed=passed,
            issues=issues,
            recommendations=recommendations,
            subagent=self.__class__.__name__
        )

class TaskVerificationWorkflow(VerificationWorkflow):
    """Verify task before execution."""
    
    def __init__(self):
        super().__init__(VerificationTrigger.TASK_CREATED)
        self.subagents = [
            ComplianceChecker(),
            SecurityAuditor(),
            QualityReviewer()
        ]
    
    async def run(self, task: dict) -> VerificationResult:
        """Verify task."""
        return await super().run({"task": task})

class PayoutVerificationWorkflow(VerificationWorkflow):
    """Verify payout before release."""
    
    def __init__(self):
        super().__init__(VerificationTrigger.PAYOUT_REQUESTED)
        self.subagents = [
            ComplianceChecker(),
            PaymentValidator(),
            LegalReviewer()
        ]
    
    async def run(self, payout: dict) -> VerificationResult:
        """Verify payout."""
        return await super().run({"payout": payout})
```

### 8.4 Automated Refinement

```python
# karma/agent/verification/refinement.py

from typing import Callable

class RefinementEngine:
    """Auto-refine based on verification results."""
    
    def __init__(self):
        self.rules = []
        self.approvals = []
    
    def add_rule(
        self, 
        condition: Callable, 
        action: Callable,
        priority: int = 0
    ):
        """Add refinement rule."""
        self.rules.append({
            "condition": condition,
            "action": action,
            "priority": priority
        })
        # Sort by priority
        self.rules.sort(key=lambda r: r["priority"])
    
    async def apply(self, context: dict) -> dict:
        """Apply refinement rules."""
        applied = []
        
        for rule in self.rules:
            if rule["condition"](context):
                result = await rule["action"](context)
                applied.append(result)
        
        return {
            "original": context,
            "refinements": applied,
            "final": self._apply_all(context, applied)
        }

# Example refinement rules
refinement = RefinementEngine()

# 1. Tax optimization
def condition_tax(context):
    return context.get("payout_amount", 0) > 30000

def action_tax(context):
    return {"action": "apply_tds", "amount": context["payout_amount"] * 0.10}

refinement.add_rule(condition_tax, action_tax, priority=1)

# 2. Trust-based routing
def condition_trust(context):
    return context.get("trust_score", 0) >= 80

def action_trust(context):
    return {"action": "route_to_verified", "priority": "high"}

refinement.add_rule(condition_trust, action_trust, priority=2)
```

---

## 9. Risk Management

### 9.1 Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|--------------|
| **Regulatory** | High | Medium | Legal consultation, compliance team |
| **Payment Failure** | High | Low | Escrow, backup providers |
| **Node Dropout** | Medium | Medium | Redundant nodes, retry logic |
| **Data Breach** | High | Low | Encryption, access control |
| **Market Fluctuation** | Medium | Medium | Pricing buffers, crypto hedging |
| **Contributor Exit** | Medium | Medium | Multi-provider network |

### 9.2 Contingency Plans

```python
# karma/backend/services/contingency.py

class ContingencyManager:
    """Handle platform contingencies."""
    
    async def handle_provider_failure(self, provider: str, task: dict):
        """Switch provider on failure."""
        # 1. Mark original as failed
        # 2. Select alternate provider
        # 3. Re-submit task
        # 4. Notify user
        ...
    
    async def handle_payment_failure(self, payout: dict):
        """Handle payment failure."""
        # 1. Retry with backup
        # 2. Queue for manual review
        # 3. Escalate if persistent
        ...
    
    async def handle_regulatory_change(self, new_regulation: dict):
        """Adapt to regulatory change."""
        # 1. Analyze impact
        # 2. Plan implementation
        # 3. Communicate to users
        # 4. Implement changes
        ...
```

### 9.3 Insurance & Guarantees

| Protection | Coverage | Provider |
|-----------|----------|----------|
| **Task Failure** | Refund | Platform escrow |
| **Payment Loss** | 100% | Escrow guarantee |
| **Data Loss** | Recovery | Backup systems |

---

## 10. Success Metrics

### 10.1 KPI Dashboard

| Metric | Phase 1 Target | Phase 2 Target | Phase 3 Target |
|--------|---------------|---------------|---------------|---------------|
| **Active Users** | 50 | 200 | 500 |
| **Tasks Completed** | 1,000 | 10,000 | 50,000 |
| **Monthly Revenue** | ₹50K | ₹5L | ₹25L |
| **Contributor Payouts** | ₹25K | ₹2.5L | ₹15L |
| **Avg Trust Score** | 60 | 75 | 85 |
| **Task Success Rate** | 90% | 95% | 98% |
| **Payment On-Time** | 95% | 98% | 99% |

### 10.2 Monitoring

```yaml
# monitoring/dashboards/karma_dashboard.json

dashboard:
  title: Karma Platform Metrics
  
  panels:
    - title: Active Contributors
      metric: karma_active_contributors
      type: gauge
      
    - title: Tasks Completed
      metric: karma_tasks_completed_total
      type: counter
      
    - title: Monthly Revenue
      metric: karma_monthly_revenue
      type: revenue
      
    - title: Trust Score Distribution
      metric: karma_trust_score
      type: histogram
      
    - title: Payment Success Rate
      metric: karma_payment_success_rate
      type: percentage
      
    - title: Compliance Status
      metric: karma_compliance_*
      type: status
```

---

## 11. Appendices

### Appendix A: Regulatory Reference

| Regulation | Source | Description |
|------------|--------|-------------|
| GST Act, 2017 | CBIC | 18% on IT services |
| Income Tax Act | IT Dept | Section 194C/J for TDS |
| RBI Directions | RBI | Digital payment guidelines |
| DPDP Act, 2023 | MeitY | Data protection |
| KYC Norms | RBI | Customer verification |

### Appendix B: GST/HST Codes

| Service | SAC Code | GST Rate |
|--------|----------|----------|
| IT Consulting | 998313 | 18% |
| Software Development | 998313 | 18% |
| Cloud Hosting | 998315 | 18% |
| Data Processing | 998314 | 18% |

### Appendix C: Contact Information

| Role | Contact |
|------|--------|
| **Legal** | legal@karma.compute |
| **Compliance** | compliance@karma.compute |
| **Support** | support@karma.compute |
| **Payments** | payments@karma.compute |

### Appendix D: Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | April 2026 | Initial draft |

---

**Next Steps:**
1. Legal consultation for final compliance verification
2. Subagent implementation planning
3. Payment gateway partner selection
4. Pilot testing with 10 contributors
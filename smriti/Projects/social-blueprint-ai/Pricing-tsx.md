---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/pages/Pricing.tsx"
project: "social-blueprint-ai"
role: config
language: tsx
frameworks: [react, typescript]
lines: 147
size: 5169 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, config, project/social-blueprint-ai, react, tsx, typescript]
---

# Pricing.tsx

> Configuration file for the project using **react, typescript** (147 lines).

**Key exports:** `Pricing`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/pages/Pricing.tsx` |
| **Role** | config |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 147 |
| **Size** | 5169 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[apiClient-ts]], [[utils-ts]]

## 📄 Content

```tsx
import React from 'react';
import { Check, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { apiFetch } from '../lib/apiClient';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Perfect for testing the waters.',
    features: [
      '1 Social Media Audit',
      'Basic Content Strategy',
      'Standard Grid Preview',
      'Community Support',
    ],
    buttonText: 'Current Plan',
    current: true,
  },
  {
    name: 'Pro',
    price: '29',
    description: 'For serious creators and brands.',
    features: [
      'Unlimited AI Audits',
      'Full 30-Day Strategy',
      'Advanced Grid Planner',
      'Brand Kit Generator',
      'PDF Report Downloads',
      'Priority AI Processing',
    ],
    buttonText: 'Upgrade to Pro',
    current: false,
    popular: true,
  },
];

export default function Pricing() {
  const handleUpgrade = async (planName: string) => {
    if (planName === 'Free') return;
    
    try {
      const data = await apiFetch('/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ priceId: 'price_mock_' + planName.toLowerCase() }),
      });
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Stripe is not configured. This is a demo.');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again later.');
    }
  };

  return (
    <div className="space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Choose the plan that's right for your growth journey. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "relative bg-white p-8 rounded-3xl border transition-all duration-300",
              plan.popular 
                ? "border-indigo-600 shadow-xl scale-105 z-10" 
                : "border-slate-200 shadow-sm hover:shadow-md"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span className="ml-1 text-slate-500">/month</span>
              </div>
              <p className="mt-4 text-slate-500 text-sm">{plan.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="mt-0.5 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(plan.name)}
              className={cn(
                "w-full py-4 rounded-xl font-bold transition-all",
                plan.current 
                  ? "bg-slate-100 text-slate-400 cursor-default" 
                  : plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    : "bg-slate-900 text-white hover:bg-slate-800"
              )}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Secure Payments</h4>
            <p className="text-sm text-slate-500">All transactions are encrypted and processed via Stripe.</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <img 
              key={i}
              src={`https://i.pravatar.cc/100?img=${i + 10}`} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          ))}
          <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700">
            +500
          </div>
        </div>
      </div>
    </div>
  );
}

```

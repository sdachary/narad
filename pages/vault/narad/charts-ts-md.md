---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/charts-ts.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 354
size: 9530 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [documentation, markdown, project/narad, service, typescript]
---

# charts-ts.md

> Service / API client module using **typescript** (354 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/charts-ts.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 354 |
| **Size** | 9530 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/src/ts/charts.ts"
project: "chitragupta"
role: service
language: typescript
frameworks: [typescript]
lines: 314
size: 8589 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, project/chitragupta, service, typescript]
---

# charts.ts

> Service / API client module using **typescript** (314 lines).

**Key exports:** `createRevenueChart`, `createPartnerDistributionChart`, `createTransactionTrendChart`, `createCategoryBreakdownChart`, `aggregateData`, `exportChartAsImage`, `destroyCharts`, `registerChart`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/ts/charts.ts` |
| **Role** | service |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 314 |
| **Size** | 8589 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
  }[];
}

export interface AggregatedData {
  monthlyIncome: { month: string; amount: number }[];
  monthlyExpenses: { month: string; amount: number }[];
  partnerDistribution: { name: string; percentage: number }[];
  transactionTrends: { date: string; count: number }[];
  categoryBreakdown: { category: string; amount: number }[];
}

export function createRevenueChart(canvas: HTMLCanvasElement, data: AggregatedData): Chart {
  const months = data.monthlyIncome.map(m => m.month);
  const income = data.monthlyIncome.map(m => m.amount);
  const expenses = data.monthlyExpenses.map(m => m.amount);

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: income,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: expenses,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e2e8f0' }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y?.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
          ticks: {
            color: '#94a3b8',
            callback: (val) => '₹' + Number(val).toLocaleString('en-IN')
          },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      }
    }
  };

  return new Chart(canvas, config);
}

export function createPartnerDistributionChart(canvas: HTMLCanvasElement, data: AggregatedData): Chart {
  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(34, 197, 94, 0.8)'
  ];

  const config: ChartConfiguration = {
    type: 'doughnut',
    data: {
      labels: data.partnerDistribution.map(p => p.name),
      datasets: [{
        data: data.partnerDistribution.map(p => p.percentage),
        backgroundColor: colors,
        borderColor: 'rgba(30, 41, 59, 0.8)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#e2e8f0', padding: 15 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  };

  return new Chart(canvas, config);
}

export function createTransactionTrendChart(canvas: HTMLCanvasElement, data: AggregatedData): Chart {
  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: data.transactionTrends.map(t => t.date),
      datasets: [{
        label: 'Transactions',
        data: data.transactionTrends.map(t => t.count),
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#e2e8f0' }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `Transactions: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      }
    }
  };

  return new Chart(canvas, config);
}

export function createCategoryBreakdownChart(canvas: HTMLCanvasElement, data: AggregatedData): Chart {
  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(234, 179, 8, 0.8)'
  ];

  const config: ChartConfiguration = {
    type: 'bar',
    data: {
      labels: data.categoryBreakdown.map(c => c.category),
      datasets: [{
        label: 'Amount',
        data: data.categoryBreakdown.map(c => c.amount),
        backgroundColor: colors,
        borderColor: 'transparent',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `₹${ctx.parsed.x?.toLocaleString('en-IN')}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#94a3b8',
            callback: (val) => '₹' + Number(val).toLocaleString('en-IN')
          },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
          ticks: { color: '#94a3b8' },
          grid: { display: false }
        }
      }
    }
  };

  return new Chart(canvas, config);
}

export function aggregateData(transactions: any[], members: any[], _services: any[]): AggregatedData {
  const monthlyIncome: { month: string; amount: number }[] = [];
  const monthlyExpenses: { month: string; amount: number }[] = [];
  const partnerDistribution: { name: string; percentage: number }[] = [];
  const categoryBreakdown: { category: string; amount: number }[] = [];

  const monthMap = new Map<string, { income: number; expense: number }>();
  const categoryMap = new Map<string, number>();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  transactions.forEach(t => {
    const date = new Date(t.created_at);
    const monthKey = months[date.getMonth()];

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { income: 0, expense: 0 });
    }

    if (t.type === 'income') {
      const current = monthMap.get(monthKey)!;
      current.income += Number(t.amount);
    } else if (t.type === 'expense') {
      const current = monthMap.get(monthKey)!;
      current.expense += Number(t.amount);
    }

    if (t.type === 'income' && t.service?.name) {
      const cat = t.service.name;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + Number(t.amount));
    }
  });

  months.forEach(m => {
    const data = monthMap.get(m) || { income: 0, expense: 0 };
    monthlyIncome.push({ month: m, amount: data.income });
    monthlyExpenses.push({ month: m, amount: data.expense });
  });

  members.forEach(m => {
    partnerDistribution.push({
      name: m.member_name,
      percentage: m.ownership_percentage || 0
    });
  });

  categoryMap.forEach((amount, category) => {
    categoryBreakdown.push({ category, amount });
  });
  categoryBreakdown.sort((a, b) => b.amount - a.amount);

  const transactionTrends: { date: string; count: number }[] = [];
  const dateMap = new Map<string, number>();
  
  transactions.forEach(t => {
    const dateKey = new Date(t.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
  });
  
  dateMap.forEach((count, date) => {
    transactionTrends.push({ date, count });
  });
  transactionTrends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    monthlyIncome,
    monthlyExpenses,
    partnerDistribution,
    transactionTrends,
    categoryBreakdown
  };
}

export function exportChartAsImage(chart: Chart, filename: string) {
  const url = chart.toBase64Image();
  const link = document.createElement('a');
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
  link.href = url;
  link.click();
}

let chartInstances: Chart[] = [];

export function destroyCharts() {
  chartInstances.forEach(chart => chart.destroy());
  chartInstances = [];
}

export function registerChart(chart: Chart) {
  chartInstances.push(chart);
}

```

```

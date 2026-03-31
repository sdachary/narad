const XLSX = require('xlsx');
const fs = require('fs');

const DB = {
  host: 'localhost',
  port: 8787
};

async function migrateData() {
  console.log('📊 Starting data migration from Excel to D1...\n');
  
  const workbook = XLSX.readFile('../Deepak Finance.xlsx');
  
  // Migrate Holdings
  console.log('📈 Migrating Holdings...');
  const holdings = XLSX.utils.sheet_to_json(workbook.Sheets['Holding'], { header: 1 });
  const holdingsData = holdings.slice(1).filter(row => row[0]); // Skip header, filter empty
  
  for (const row of holdingsData) {
    const symbol = row[0];
    const name = symbol; // Use symbol as name placeholder (can be enhanced)
    const quantity = row[1] || 0;
    const avg_cost = row[2] || 0;
    const ltp = row[3] || 0;
    const invested = row[4] || 0;
    const current_value = row[5] || 0;
    const pnl = row[6] || 0;
    const net_chg_percent = row[7] || 0;
    const day_chg_percent = row[8] || 0;
    
    const query = `
      INSERT INTO holdings (symbol, name, quantity, avg_cost, ltp, invested, current_value, pnl, net_chg_percent, day_chg_percent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const response = await fetch(`${DB.host}:${DB.port}/api/finance/holdings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol, name, quantity, avg_cost, ltp, invested, current_value, pnl, net_chg_percent, day_chg_percent
        })
      });
      if (response.ok) {
        console.log(`  ✅ ${symbol}`);
      } else {
        console.log(`  ⚠️ ${symbol} - already exists or error`);
      }
    } catch (e) {
      console.log(`  ❌ ${symbol} - ${e.message}`);
    }
  }
  
  // Migrate Dividends
  console.log('\n💰 Migrating Dividends...');
  const dividend = XLSX.utils.sheet_to_json(workbook.Sheets['Dividend'], { header: 1 });
  
  const dividendStocks = [];
  for (let i = 3; i <= 7; i++) {
    if (dividend[i] && dividend[i][0]) {
      dividendStocks.push({
        symbol: dividend[i][0],
        name: dividend[i][1],
        ltp: dividend[i][2] || 0,
        allocation: dividend[i][3] || 0,
        monthly_sip: dividend[i][4] || 0,
        quantity: dividend[i][5] || 0,
        actual_sip: dividend[i][6] || 0
      });
    }
  }
  
  for (const d of dividendStocks) {
    try {
      const response = await fetch(`${DB.host}:${DB.port}/api/finance/dividends`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d)
      });
      if (response.ok) {
        console.log(`  ✅ ${d.symbol}`);
      } else {
        console.log(`  ⚠️ ${d.symbol}`);
      }
    } catch (e) {
      console.log(`  ❌ ${d.symbol}`);
    }
  }
  
  // Migrate Recurring
  console.log('\n🔄 Migrating Recurring...');
  const recurring = XLSX.utils.sheet_to_json(workbook.Sheets['Recurring'], { header: 1 });
  
  const recurringData = [];
  for (let i = 2; i < recurring.length; i++) {
    if (recurring[i] && recurring[i][1]) {
      recurringData.push({
        category: recurring[i][1],
        name: recurring[i][2],
        amount: recurring[i][3] || 0,
        frequency: recurring[i][4] === 'Annual' ? 'annual' : 
                   recurring[i][4] === 'Quarter' ? 'quarter' : 
                   recurring[i][4] === 'Monthly' ? 'monthly' : 'monthly',
        start_date: recurring[i][5],
        end_date: recurring[i][6] === '-' ? null : recurring[i][6],
        monthly_saving: recurring[i][7] || 0,
        planned_saving: recurring[i][8] || 0,
        actual_saving: recurring[i][9] || 0,
        is_paid: recurring[i][12] === true ? 1 : 0
      });
    }
  }
  
  for (const r of recurringData) {
    try {
      const response = await fetch(`${DB.host}:${DB.port}/api/finance/recurring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r)
      });
      if (response.ok) {
        console.log(`  ✅ ${r.name}`);
      } else {
        console.log(`  ⚠️ ${r.name}`);
      }
    } catch (e) {
      console.log(`  ❌ ${r.name}`);
    }
  }
  
  // Migrate Accounts from Summary
  console.log('\n🏦 Migrating Accounts...');
  const summary = XLSX.utils.sheet_to_json(workbook.Sheets['Summary'], { header: 1 });
  
  const accounts = [];
  // Bank balances (row 1)
  const bankRows = [
    ['Amazon Pay', 'wallet', summary[1][2]],
    ['Axis Bank', 'bank', summary[2][1]],
    ['Federal', 'bank', summary[3][1]],
    ['ICICI', 'bank', summary[4][1]]
  ];
  
  for (const acc of bankRows) {
    if (acc[2] > 0) {
      accounts.push({ name: acc[0], type: acc[1], balance: acc[2] });
    }
  }
  
  // Investment accounts
  const investRows = [
    ['eNPS', 'investment', summary[1][4]],
    ['ICICI MF', 'investment', summary[2][4]],
    ['Zerodha Holding', 'investment', summary[3][4]]
  ];
  
  for (const acc of investRows) {
    if (acc[2] > 0) {
      accounts.push({ name: acc[0], type: acc[1], balance: acc[2] });
    }
  }
  
  // Loans
  const loanRows = [
    ['Anil', 'loan', summary[1][6]],
    ['Axis MZ Visa', 'loan', summary[2][6]],
    ['Axis Prestige', 'loan', summary[3][6]],
    ['ICICI Amazon', 'loan', summary[4][6]]
  ];
  
  for (const acc of loanRows) {
    if (acc[2] > 0) {
      accounts.push({ name: acc[0], type: acc[1], balance: acc[2] });
    }
  }
  
  for (const acc of accounts) {
    try {
      const response = await fetch(`${DB.host}:${DB.port}/api/finance/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(acc)
      });
      if (response.ok) {
        console.log(`  ✅ ${acc.name} (${acc.type})`);
      }
    } catch (e) {
      console.log(`  ❌ ${acc.name}`);
    }
  }
  
  // Migrate Commodities
  console.log('\n🥇 Migrating Commodities...');
  const commodities = [
    { name: 'Gold', price: 121400, change: 168, change_percent: 0.14 },
    { name: 'Silver', price: 148927, change: 640, change_percent: 0.43 },
    { name: 'Crude Oil', price: 5447, change: 25, change_percent: 0.46 },
    { name: 'Natural Gas', price: 364.4, change: -0.5, change_percent: -0.14 }
  ];
  
  for (const c of commodities) {
    try {
      const response = await fetch(`${DB.host}:${DB.port}/api/finance/commodities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c)
      });
      if (response.ok) {
        console.log(`  ✅ ${c.name}`);
      }
    } catch (e) {
      console.log(`  ❌ ${c.name}`);
    }
  }
  
  console.log('\n✨ Migration complete!');
}

migrateData().catch(console.error);

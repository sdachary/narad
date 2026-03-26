/**
 * scripts/test-connection.js
 *
 * Diagnostic tool to test the connection to the AGI worker.
 * Run with: node scripts/test-connection.js
 */

import 'dotenv/config';

async function main() {
  const url = process.env.AGI_WORKER_URL || 'https://nisha-agi.pages.dev';
  const endpoint = `${url.replace(/\/$/, '')}/api/health`;

  console.log('🔮 Narad Connection Diagnostics');
  console.log('───────────────────────────────');
  console.log(`📡 URL from .env: ${url}`);
  console.log(`🎯 Testing Health Endpoint: ${endpoint}`);
  console.log('───────────────────────────────\n');

  try {
    const start = Date.now();
    const res = await fetch(endpoint);
    const latency = Date.now() - start;

    console.log(`✅ Result: ${res.status} ${res.statusText}`);
    console.log(`⏱️ Latency: ${latency}ms`);

    if (res.ok) {
      const data = await res.json();
      console.log('📄 Response:', JSON.stringify(data, null, 2));
      console.log('\n✨ CONNECTION SUCCESSFUL! The VM can reach the AGI worker.');
      console.log('\n💡 Tip: If the bot is still failing, restart it with:');
      console.log('   sudo systemctl restart narad');
    } else {
      console.error('\n⚠️ Worker returned an error. Check Cloudflare Dashboard logs.');
    }

  } catch (err) {
    console.error('\n❌ CONNECTION FAILED');
    console.error(`💥 Error: ${err.message}`);

    if (err.code === 'ENOTFOUND') {
      console.error('\n💡 Explanation: The domain name could not be resolved.');
      console.error('   Check if AGI_WORKER_URL is correct in your .env file.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('\n💡 Explanation: The connection was refused.');
      console.error('   Check if the URL is correct and the worker is active.');
    } else {
        console.error('\n💡 Try these steps:');
        console.error('   1. Ensure you have internet access on this VM.');
        console.error('   2. Verify that https://narad-7hc.pages.dev works in your browser.');
        console.error(`   3. Check if your Node.js version (${process.version}) supports fetch.`);
    }
  }
}

main();

// narad/pages/services/agents.js
import { getApiClient } from './ai';
import { SUBAGENTS } from '../config/agents.js';
import { handleFinanceCommand } from './finance.js';

function detectAgent(message) {
  const lower = message.toLowerCase();
  for (const [id, agent] of Object.entries(SUBAGENTS)) {
    if (agent.keywords?.some(k => lower.includes(k))) {
      return id;
    }
  }
  return 'commander';
}

export async function routeAgent(c, message, context = {}) {
  const agentId = detectAgent(message);

  // Handle Finance commands specifically
  if (agentId === 'finance') {
    const financeResponse = await handleFinanceCommand(c.env, message);
    if (financeResponse) {
      return financeResponse;
    }
  }

  const agent = SUBAGENTS[agentId] || { 
    name: 'Commander', 
    systemPrompt: 'You are the main orchestrating agent. Route requests to specialized agents based on user intent.' 
  };
...
  // Add agent context to prompt
  const systemPrompt = agent.systemPrompt;
...
  // Call AI with agent context
  const client = getApiClient(c.env);
  const response = await client.chat.completions.create({
    model: c.env.PRIMARY_MODEL || 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      ...(context.messages || []),
      { role: 'user', content: message }
    ],
  });
  
  return {
    reply: response.choices[0].message.content,
    agent: agentId,
  };
}

export default { routeAgent, SUBAGENTS };

// narad/src/context/AgentContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AGENTS = {
  commander: {
    name: 'Commander',
    icon: '🎯',
    systemPrompt: 'You are the main routing agent. Understand user intent and delegate to specialized agents.',
  },
  observer: {
    name: 'Observer',
    icon: '👁️',
    systemPrompt: 'You monitor service health and status. Gather metrics and report issues.',
    keywords: ['status', 'health', 'monitor', 'check'],
  },
  reporter: {
    name: 'Reporter',
    icon: '📊',
    systemPrompt: 'You generate reports and summaries. Create daily and weekly insights.',
    keywords: ['report', 'summary', 'alert', 'daily'],
  },
  researcher: {
    name: 'Researcher',
    icon: '🔬',
    systemPrompt: 'You search the web for accurate, well-sourced information.',
    keywords: ['search', 'find', 'research', 'look up'],
  },
  coder: {
    name: 'Coder',
    icon: '💻',
    systemPrompt: 'You write clean, efficient code and help debug issues.',
    keywords: ['code', 'implement', 'debug', 'fix'],
  },
  writer: {
    name: 'Writer',
    icon: '✍️',
    systemPrompt: 'You create clear, engaging content and documentation.',
    keywords: ['write', 'draft', 'docs', 'content'],
  },
};

const AgentContext = createContext(null);

export function AgentProvider({ children }) {
  const [currentAgent, setCurrentAgent] = useState('commander');
  const [agentHistory, setAgentHistory] = useState([]);

  const routeToAgent = (message) => {
    const lower = message.toLowerCase();
    for (const [id, agent] of Object.entries(AGENTS)) {
      if (agent.keywords?.some(k => lower.includes(k))) {
        return id;
      }
    }
    return 'commander';
  };

  return (
    <AgentContext.Provider value={{ agents: AGENTS, currentAgent, setCurrentAgent, routeToAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (!context) throw new Error('useAgent must be used within AgentProvider');
  return context;
}

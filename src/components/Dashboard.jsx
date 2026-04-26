import React, { useState, useEffect } from 'react';
import ServiceTile from './ServiceTile';
import { useServices } from '../hooks/useServices';
import { X, ExternalLink, ArrowRight, MessageSquare } from 'lucide-react';

const SERVICES = [
  { id: 'vishwakarma', name: 'Vishwakarma', url: 'https://vishwakarma.pages.dev', icon: '🚀', desc: 'Cloud Provisioning' },
  { id: 'chitragupta', name: 'Chitragupta', url: 'https://chitragupta.pages.dev', icon: '📊', desc: 'Financial Settlement' },
  { id: 'mcp-hub', name: 'MCP Hub', url: null, local: true, port: 3000, icon: '🔗', desc: 'AI Orchestration' },
  { id: 'kanak', name: 'Kanak', url: 'https://kanak-dj5.pages.dev', icon: '📈', desc: 'BI Dashboard' },
  { id: 'unnati', name: 'Unnati', url: 'https://unnati-70z.pages.dev', icon: '💼', desc: 'Career Assistant' },
];

export default function Dashboard() {
  const { services } = useServices();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatPrompt = params.get('chat');
    if (chatPrompt) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('narad:send-chat', { 
          detail: { text: decodeURIComponent(chatPrompt) } 
        }));
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 1000);
    }
  }, []);

  return (
    <div 
      className="p-6 max-w-[1400px] mx-auto h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      {/* Services Grid */}
      <div>
        <h2 className="text-[10px] font-black text-[var(--text-secondary)] mb-3 uppercase tracking-[0.2em]">Platform Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SERVICES.map(service => {
            const serviceStatus = services?.[service.id] || { status: 'online', metric: 'Active' };
            return (
              <ServiceTile
                key={service.id}
                service={service}
                status={serviceStatus.status}
                metric={serviceStatus.metric}
                onClick={() => {
                  if (service.url) {
                    window.open(service.url, '_blank');
                  } else if (service.local) {
                    window.open(`http://localhost:${service.port}`, '_blank');
                  }
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-[10px] font-black text-[var(--text-secondary)] mb-3 uppercase tracking-[0.2em]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('narad:switch-view', { detail: { view: 'chat' } }))}
            className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-sm">Open Chat</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
          </button>
          <button 
            onClick={() => window.open('http://localhost:3000/api/health', '_blank')}
            className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <span className="text-xl">🔗</span>
            <span className="text-sm">MCP Hub Status</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
          </button>
          <button 
            onClick={() => window.open('/api/dashboard/services', '_blank')}
            className="flex items-center gap-3 p-4 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <span className="text-xl">📊</span>
            <span className="text-sm">All Services API</span>
            <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import ServiceTile from './ServiceTile';
import { useServices } from '../hooks/useServices';
import { MessageSquare } from 'lucide-react';

const SERVICES = [
  { id: 'narad', name: 'Narad', url: 'https://narad.pages.dev', icon: '🤖', desc: 'AI Chat' },
  { id: 'vishwakarma', name: 'Vishwakarma', url: 'https://vishwakarma.pages.dev', icon: '🚀', desc: 'Cloud Provisioning' },
  { id: 'chitragupta', name: 'Chitragupta', url: 'https://chitragupta.pages.dev', icon: '📊', desc: 'Financial Settlement' },
  { id: 'karma', name: 'Karma', url: 'https://karma.compute', icon: '⚖️', desc: 'Finance Tracking' },
  { id: 'kanak', name: 'Kanak', url: 'https://kanak-dj5.pages.dev', icon: '📈', desc: 'BI Dashboard' },
  { id: 'unnati', name: 'Unnati', url: 'https://unnati-70z.pages.dev', icon: '💼', desc: 'Career Assistant' },
  { id: 'indra', name: 'Indra', url: 'https://indra.onrender.com', icon: '👁️', desc: 'n8n Automation' },
  { id: 'social-blueprint-ai', name: 'Social Blueprint', url: 'https://social-blueprint-ai.pages.dev', icon: '🎯', desc: 'Social Media' },
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
      <div>
        <h2 className="text-[10px] font-black text-[var(--text-secondary)] mb-3 uppercase tracking-[0.2em]">Cloud Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {SERVICES.map(service => {
            const serviceStatus = services?.[service.id] || { status: 'online', metric: 'Active' };
            return (
              <ServiceTile
                key={service.id}
                service={service}
                status={serviceStatus.status}
                metric={serviceStatus.metric}
                onClick={() => service.url && window.open(service.url, '_blank')}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
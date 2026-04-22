import React, { useState, useEffect } from 'react';
import ServiceTile from './ServiceTile';
import PortfolioTile from './PortfolioTile';
import FinanceTile from './FinanceTile';
import { useServices } from '../hooks/useServices';
import { X, ExternalLink, ArrowRight } from 'lucide-react';

const SERVICES = [
  { id: 'vishwakarma', name: 'Vishwakarma', url: 'https://vishwakarma.pages.dev' },
  { id: 'chitragupta', name: 'Chitragupta', url: 'https://chitragupta.pages.dev' },
  { id: 'karma', name: 'Karma', url: null, comingSoon: true },
  { id: 'kanak', name: 'Kanak', url: 'https://kanak-dj5.pages.dev' },
  { id: 'unnati', name: 'Unnati', url: 'https://unnati-70z.pages.dev' },
];

export default function Dashboard() {
  const { services } = useServices();

  useEffect(() => {
    // Handle auto-chat from redirects
    const params = new URLSearchParams(window.location.search);
    const chatPrompt = params.get('chat');
    if (chatPrompt) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('narad:send-chat', { 
          detail: { text: decodeURIComponent(chatPrompt) } 
        }));
        // Clean up URL without reload
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 1000);
    }
  }, []);

  const handleTileClick = (tab) => {
    window.location.href = `/${tab}.html`;
  };

  return (
    <div 
      className="p-6 max-w-[1400px] mx-auto h-full relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      {/* Services Row */}
      <div className="mb-6">
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
                onClick={() => service.url && window.open(service.url, '_blank')}
              />
            );
          })}
        </div>
      </div>

      {/* Features Row */}
      <div>
        <h2 className="text-[10px] font-black text-[var(--text-secondary)] mb-3 uppercase tracking-[0.2em]">Financial Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PortfolioTile onClick={() => handleTileClick('portfolio')} />
          <FinanceTile onClick={() => handleTileClick('finance')} />
        </div>
      </div>
    </div>
  );
}

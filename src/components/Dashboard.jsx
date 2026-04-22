import React, { useState } from 'react';
import ServiceTile from './ServiceTile';
import PortfolioTile from './PortfolioTile';
import FinanceTile from './FinanceTile';
import { useServices } from '../hooks/useServices';
import { usePortfolio } from '../hooks/usePortfolio';
import { useFinance } from '../hooks/useFinance';
import { X, ExternalLink, ArrowRight } from 'lucide-react';

import ManagementModal from './ManagementModal';

const SERVICES = [
  { id: 'vishwakarma', name: 'Vishwakarma', url: 'https://vishwakarma.pages.dev' },
  { id: 'chitragupta', name: 'Chitragupta', url: 'https://chitragupta.pages.dev' },
  { id: 'karma', name: 'Karma', url: null, comingSoon: true },
  { id: 'kanak', name: 'Kanak', url: 'https://kanak-dj5.pages.dev' },
  { id: 'unnati', name: 'Unnati', url: 'https://unnati-70z.pages.dev' },
];

export default function Dashboard() {
  const { services } = useServices();
  const [showManagement, setShowManagement] = useState(false);
  const [managementTab, setManagementTab] = useState('portfolio');

  const handleTileClick = (tab) => {
    setManagementTab(tab);
    setShowManagement(true);
  };

  return (
    <div 
      className="p-6 max-w-[1400px] mx-auto min-h-screen relative"
      style={{ backgroundColor: 'var(--bg-canvas)' }}
    >
      <ManagementModal 
        isOpen={showManagement} 
        onClose={() => setShowManagement(false)} 
        initialTab={managementTab} 
      />

      <h1 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">
        Command Center
      </h1>
      
      {/* Services Row */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wider">Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-3 uppercase tracking-wider">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PortfolioTile onClick={() => handleTileClick('portfolio')} />
          <FinanceTile onClick={() => handleTileClick('finance')} />
        </div>
      </div>
    </div>
  );
}

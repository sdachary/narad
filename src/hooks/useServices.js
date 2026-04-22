// narad/src/hooks/useServices.js
import { useState, useEffect } from 'react';

export function useServices() {
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/observer/services');
      const data = await res.json();
      setServices(data.services || data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  return { services, loading, error, refetch: fetchServices };
}

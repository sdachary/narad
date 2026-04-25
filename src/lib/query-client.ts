import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  // Use state to ensure the query client is only created once on the client
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

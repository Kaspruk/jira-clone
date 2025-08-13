'use client'
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top

import { memo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { getQueryClient } from '@/lib/react-query';
import { useColorTheme } from '@/components/ThemeToggle';

interface ProviderProps {
  children: React.ReactNode;
};

export const Providers = memo(({ children }: ProviderProps) => {
  useColorTheme();

  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <SessionProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools 
              initialIsOpen={false}
              buttonPosition="bottom-right"
              errorTypes={[]}
              client={queryClient}
            />
          )}
        </QueryClientProvider>
      </NuqsAdapter>
    </SessionProvider>
  )
});
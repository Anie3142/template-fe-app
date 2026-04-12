'use client';

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useEffect, useState } from 'react';

// Bump this when you make a breaking change to the cached shape (e.g. API
// schema rename) so old localStorage entries are dropped instead of crashing.
const PERSIST_BUSTER = 'v1-2026-04-11';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Senior-dev defaults: keep data warm for 5 min so navigating
            // between pages doesn't hammer the API. gcTime is bumped to 24h
            // so persistence has a useful window — TanStack only persists
            // queries that are still inside gcTime.
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 24 * 60 * 60 * 1000, // 24 hours (persistence window)
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      }),
  );

  // Persister has to be built in the browser — localStorage doesn't exist on
  // the server. Gate creation behind an effect so SSR/RSC doesn't crash.
  const [persister, setPersister] = useState<ReturnType<typeof createSyncStoragePersister> | null>(null);
  useEffect(() => {
    setPersister(
      createSyncStoragePersister({
        storage: window.localStorage,
        key: 'template-query-cache',
        // Throttle writes to localStorage so a burst of mutations doesn't
        // hammer the main thread.
        throttleTime: 1000,
      }),
    );
  }, []);

  return (
    <UserProvider>
      {persister ? (
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister,
            // Anything older than 24h is dropped on hydrate. Matches gcTime.
            maxAge: 24 * 60 * 60 * 1000,
            buster: PERSIST_BUSTER,
            // Don't persist failed queries — only successful ones are useful
            // to paint from cache on the next visit.
            dehydrateOptions: {
              shouldDehydrateQuery: (query) => query.state.status === 'success',
            },
          }}
        >
          {children}
        </PersistQueryClientProvider>
      ) : (
        // First-render fallback before window.localStorage is available.
        // Plain QueryClientProvider; the persister takes over on the next
        // render and in-flight queries hydrate from disk automatically.
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )}
    </UserProvider>
  );
}

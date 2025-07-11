import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // Запобігає повторному завантаженню під час гідрації
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
        // Встановлюємо час зберігання кешу
        gcTime: 1000 * 60 * 60 * 24, // 24 години
        // Налаштування повторних спроб
        retry: (failureCount) => {
          if (failureCount < 3) {
            console.log(`Спроба ${failureCount + 1} невдала, повторюємо...`);
            return true;
          }
          return false;
        },
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

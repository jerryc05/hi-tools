/* @refresh reload */

import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render } from 'solid-js/web'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')
const queryClient = new QueryClient({
  defaultOptions: { queries: { gcTime: 0 } },
})

if (root)
  render(
    () => (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    ),

    root,
  )

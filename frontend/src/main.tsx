import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/Toast'
import App from '@/app/App'
import './index.css'

/* ToastProvider sits above the router so a toast survives navigation (a redirect after
   submitting a form must not swallow its confirmation). */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)

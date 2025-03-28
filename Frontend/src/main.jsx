import { StrictMode } from 'react'
import { ThemeProvider } from "./components/features/theme"
import { createRoot } from 'react-dom/client'
import './theme.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

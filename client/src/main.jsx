import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from './context/SidebarContext'
import MobileBlock from './components/MobileBlock.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MobileBlock>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ThemeProvider>
    </MobileBlock>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/global.scss';
import {AuthProvider} from "./Provider/AuthProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  </StrictMode>,
)

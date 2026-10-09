import React from 'react'
import { createRoot } from 'react-dom/client' // <-- Make sure this is correct
import App from './App.jsx'
import './index.css' // Tailwind v4 import

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
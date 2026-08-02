import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Add these two lines to import your CSS
import './assets/css/style.css'
import './assets/css/components.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
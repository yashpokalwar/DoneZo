// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider} from "./context/language.jsx"; // Import Language Context

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <LanguageProvider >

    <App />

  </LanguageProvider>
)
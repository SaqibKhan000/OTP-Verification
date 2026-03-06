import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import emailjs from '@emailjs/browser';
import { emailConfig } from './config/emailConfig';

// Initialize EmailJS with Public Key
emailjs.init(emailConfig.publicKey);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

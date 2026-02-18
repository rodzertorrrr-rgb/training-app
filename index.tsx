
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
const loader = document.getElementById('initial-loader');
const errDisplay = document.getElementById('error-display');

const hideLoader = () => {
    if (loader) loader.style.display = 'none';
};

if (!rootElement) {
  const err = "FATAL: Could not find root element to mount to";
  console.error(err);
  document.body.innerHTML = `<div style="color:red; padding:20px;">${err}</div>`;
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React mounting initiated.");
    
    // Timeout scurt pentru a lăsa React să facă prima randare
    setTimeout(hideLoader, 100);
    
  } catch (err) {
    console.error("FATAL: React mount failed", err);
    hideLoader();
    if (errDisplay) {
        errDisplay.style.display = 'block';
        errDisplay.innerText = "CRITICAL BOOT ERROR: " + err + "\n\nConsultă consola pentru detalii.";
    }
  }
}

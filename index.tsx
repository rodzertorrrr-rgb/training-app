
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  const err = "FATAL: Could not find root element to mount to";
  console.error(err);
  document.body.innerHTML = `<div style="color:red; padding:20px;">${err}</div>`;
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React mounted successfully.");
    
    // Hide loader if it exists
    const loader = document.getElementById('initial-loader');
    if (loader) loader.style.display = 'none';
    
  } catch (err) {
    console.error("FATAL: React mount failed", err);
    const errDisplay = document.getElementById('error-display');
    const loader = document.getElementById('initial-loader');
    
    if (loader) loader.style.display = 'none';
    if (errDisplay) {
        errDisplay.style.display = 'block';
        errDisplay.innerText = "React Mount Failed: " + err + "\n\nCheck console for details.";
    }
  }
}

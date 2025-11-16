// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';  // Từ fix App.css
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Add import
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* Wrap App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
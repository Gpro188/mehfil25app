import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Add a simple console log to verify the index file is loading
console.log('Index file loading');

// Add a simple DOM check
console.log('DOM ready state:', document.readyState);
console.log('Root element exists:', !!document.getElementById('root'));

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('App component rendered');
} else {
  console.error('Root element not found!');
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
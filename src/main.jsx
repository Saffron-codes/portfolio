import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./styles/index.css";

// Motion styles (reveals, word-by-word name) only apply once JS is running.
document.documentElement.classList.add("js-motion");

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

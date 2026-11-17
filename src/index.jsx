import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/sections.css';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Flag JS + motion preference before first paint so reveal states never flash.
const root = document.documentElement;
root.classList.add('js');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('reduced-motion');

createRoot(document.getElementById('root')).render(<App />);

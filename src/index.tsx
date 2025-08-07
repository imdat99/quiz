import ReactDOM from 'react-dom/client';
import App from './App';
import 'uno.css';
document.addEventListener('contextmenu', e => e.preventDefault());
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
      <App />
  );
}

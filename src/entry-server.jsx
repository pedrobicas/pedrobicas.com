import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { parseRoute } from './routing.js';
import { setInitialProject } from './state/selectedProject.js';

// Gera o HTML de uma rota durante o build. O runtime visual não roda no servidor.
export function render(pathname) {
  setInitialProject(parseRoute(pathname).slug);
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

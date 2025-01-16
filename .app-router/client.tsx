import { PageModule } from 'app-router/index';
import routesConfig from 'app-router/routes';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

window.addEventListener('DOMContentLoaded', async () => {
  const rootElement = window.document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  const PageComponent = () => (
    <BrowserRouter>
      <Routes>
        {Object.entries<PageModule>(routesConfig).map(
          ([path, { default: Component }]) => (
            <Route
              key={path}
              path={convertPath(path.replace(/\/$/, ''))}
              element={<Component {...window.__INITIAL_PROPS__} />}
            />
          ),
        )}
      </Routes>
    </BrowserRouter>
  );

  hydrateRoot(rootElement, createElement(PageComponent));
});

declare global {
  interface Window {
    __INITIAL_PROPS__: any;
  }
}

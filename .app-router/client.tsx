import { PageProps } from 'app-router/index';
import routesConfig from 'app-router/routes';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

window.addEventListener('pageshow', function (event: PageTransitionEvent) {
  if (event.persisted) {
    window.location.reload();
  }
});

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

window.addEventListener('DOMContentLoaded', async () => {
  const rootElement = window.document.body;

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  const PageComponent = () => (
    <BrowserRouter>
      <Routes>
        {Object.entries<PageProps>(routesConfig).map(
          ([path, { Component }]) => (
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

  hydrateRoot(rootElement, createElement(PageComponent as any));
});

declare global {
  interface Window {
    __INITIAL_PROPS__: any;
  }
}

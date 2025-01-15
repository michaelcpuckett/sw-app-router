declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import { PageShell } from 'app-router/PageShell';
import routesConfig from 'app-router/routes';
import staticFiles from 'app-router/static.json';
import { renderToString } from 'react-dom/server';
import { version } from '../dist/cache.json';
import * as NotFoundPageModule from './NotFoundPage';

export type PageComponent = React.ComponentType<any>;

export type Params = Record<string, string>;

export type GetStaticProps = (params: Params) => Promise<Record<string, any>>;

export interface Metadata {
  title: string;
  description?: string;
}

export type PageModule = {
  default: PageComponent;
  getStaticProps: GetStaticProps;
  metadata: Metadata;
};

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

export default (function useAppRouterArchitecture() {
  // Populates the cache on install.
  self.addEventListener('install', function handleInstall(event: Event) {
    if (!(event instanceof ExtendableEvent)) {
      return;
    }

    self.skipWaiting();

    event.waitUntil(
      (async () => {
        const urlsToCache = staticFiles.map((url) => {
          return new Request(new URL(url, self.location.origin).href);
        });
        const cache = await caches.open('dist');
        await cache.addAll(urlsToCache);
      })(),
    );
  });

  // Immediately takes control of the page on activation.
  self.addEventListener('activate', () => {
    self.clients.claim();
  });

  const app = new ExpressWorker();

  // Serve static files.
  (function useStaticFiles() {
    app.get('*', async (req, res) => {
      const cachedResponse = await Promise.all(
        (await caches.keys()).map(async (cacheName) => {
          return await (await caches.open(cacheName)).match(req.url);
        }),
      ).then((responses) => responses.find((response) => response));

      if (cachedResponse) {
        res.wrap(cachedResponse);
      } else {
        const notFoundPageStaticProps =
          await NotFoundPageModule.getStaticProps();

        const renderResult = renderToString(
          <NotFoundPageModule.default {...notFoundPageStaticProps} />,
        );

        res.status(404).send(renderResult);
      }
    });
  })();

  (function useAppRouter() {
    for (const [
      path,
      { default: Component, getStaticProps, metadata },
    ] of Object.entries<PageModule>(routesConfig)) {
      app.get(convertPath(path), async (req, res) => {
        if (navigator.onLine) {
          fetch('/cache.json', {
            cache: 'no-cache',
          })
            .then((response) => response.json())
            .then((cache) => {
              if (cache.version !== version) {
                console.log(
                  'Cache version mismatch. Reinstalling service worker.',
                );

                self.registration.unregister();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }

        try {
          const initialProps = await getStaticProps(req.params);
          const cache = await caches.open('dist');
          const cssUrls = staticFiles.filter((url) => url.endsWith('.css'));
          const cssFileContents = (
            await Promise.all(
              cssUrls.map(async (url) => {
                const response = await cache.match(url);

                if (!response) {
                  throw new Error('Cache miss.');
                }

                return response.text();
              }),
            )
          ).join('\n\n');

          const jsFile = await cache.match('/client.js');

          if (!jsFile) {
            throw new Error('Cache miss.');
          }

          const jsFileContents = await jsFile.text();

          const renderResult = renderToString(
            <PageShell
              metadata={metadata}
              initialProps={initialProps}
              css={cssFileContents}
              js={jsFileContents}
            >
              <Component {...initialProps} />
            </PageShell>,
          );

          res.send(renderResult);
        } catch (error) {
          console.log(error);
          const notFoundPageStaticProps =
            await NotFoundPageModule.getStaticProps();

          const renderResult = renderToString(
            <NotFoundPageModule.default {...notFoundPageStaticProps} />,
          );
          res.status(404).send(renderResult);
        }
      });
    }
  })();

  return app;
})();

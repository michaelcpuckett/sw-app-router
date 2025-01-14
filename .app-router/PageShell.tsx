import { GetStaticProps, Metadata } from 'app-router/index';
import staticFiles from 'app-router/static.json';
import React from 'react';

export function PageShell(
  props: React.PropsWithChildren<{
    initialProps: Awaited<ReturnType<GetStaticProps>>;
    metadata: Metadata;
  }>,
) {
  const cssUrls = staticFiles.filter((url) => url.endsWith('.css'));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          httpEquiv="Cache-Control"
          content="no-store"
        />
        {props.metadata.title && <title>{props.metadata.title}</title>}
        {props.metadata.description && (
          <meta
            name="description"
            content={props.metadata.description}
          />
        )}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        {cssUrls.map((url) => (
          <link
            key={url}
            rel="stylesheet"
            href={url}
          />
        ))}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_PROPS__ = ${JSON.stringify(
              props.initialProps,
            )}`,
          }}
        />
        <script src="/client.js"></script>
      </head>
      <body>{props.children}</body>
    </html>
  );
}

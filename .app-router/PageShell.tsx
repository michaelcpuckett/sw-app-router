import { GetStaticProps, Metadata } from 'app-router/index';
import React from 'react';

export function PageShell(
  props: React.PropsWithChildren<{
    initialProps: Awaited<ReturnType<GetStaticProps>>;
    metadata: Metadata;
    css: string;
    js: string;
  }>,
) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          httpEquiv="Cache-Control"
          content="no-store"
        />
        <title>{props.metadata.title}</title>
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
        <style
          dangerouslySetInnerHTML={{
            __html: props.css,
          }}
        ></style>
      </head>
      <body>
        <div id="root">{props.children}</div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_PROPS__ = ${JSON.stringify(
              props.initialProps,
            )}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: props.js.replace(/<\/script>/g, '</scr"+"ipt>'),
          }}
        />
      </body>
    </html>
  );
}

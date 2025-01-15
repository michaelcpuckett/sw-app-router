import { PageShell } from './PageShell';

export async function getStaticProps() {
  const cache = await caches.open('dist');
  const cssFiles = (await cache.keys()).filter((key) =>
    key.url.endsWith('.css'),
  );

  const cssFileContents = (
    await Promise.all(
      cssFiles.map(async (file) => {
        const response = await cache.match(file.url);

        if (!response) {
          return '';
        }

        return response.text();
      }),
    )
  ).join('\n\n');

  return {
    css: cssFileContents,
  };
}

export default function NotFoundPage({ css }: { css: string }) {
  return (
    <PageShell
      initialProps={{}}
      metadata={{
        title: 'Not Found',
      }}
      css={css}
      js=""
    >
      <header>
        <h1>Not Found</h1>
      </header>
      <main>
        <p>Page not found</p>
      </main>
    </PageShell>
  );
}

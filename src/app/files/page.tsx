import { GetStaticProps, Metadata } from 'app-router/index';
import { ChangeEventHandler, Fragment, useCallback, useState } from 'react';

export const metadata: Metadata = {
  title: 'Files',
};

export const getStaticProps: GetStaticProps = async function (params) {
  const cache = await caches.open('uploads');
  const keys = await cache.keys();

  return {
    initialFileUrls: keys.map((request) => request.url),
  };
};

export default function FilesPage({
  initialFileUrls,
}: {
  initialFileUrls: string[];
}) {
  const [fileUrls, setFileUrls] = useState<string[]>(initialFileUrls);

  const addFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (event) => {
      const files = event.target.files;

      if (!files || files.length === 0) {
        return;
      }

      const cache = await caches.open('uploads');

      await Promise.all(
        Array.from(files).map(async (file) => {
          const url = new URL('/uploads/' + file.name, self.location.origin)
            .href;
          const blob = new Blob([file], { type: file.type });
          const contentLength = blob.size;

          const response = new Response(blob, {
            status: 200,
            headers: {
              'Content-Type': file.type,
              'Content-Length': contentLength.toString(),
              'Last-Modified': new Date().toUTCString(),
            },
          });

          const request = new Request(url);

          await cache.put(request, response);

          setFileUrls((fileUrls) => [...fileUrls, url]);
        }),
      );
    },
    [setFileUrls],
  );

  return (
    <Fragment>
      <header>
        <h1>Files</h1>
      </header>
      <nav>
        <a
          className="button"
          href="/"
        >
          Back
        </a>
      </nav>
      <br />
      <main>
        <input
          type="file"
          multiple
          onChange={addFile}
        />
        <ul>
          {fileUrls.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
              >
                {url}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </Fragment>
  );
}

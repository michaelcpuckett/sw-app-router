import { ChangeEventHandler, Fragment, useCallback, useState } from 'react';
import { GetStaticProps, Metadata } from 'swarf';

export const metadata: Metadata = {
  title: 'Image Gallery',
};

export const getStaticProps: GetStaticProps = async function () {
  const cache = await caches.open('uploads');
  const keys = await cache.keys();

  return {
    props: {
      initialImageUrls: keys.map((request) => request.url),
    },
  };
};

export default function ImageGalleryPage({
  initialImageUrls,
}: {
  initialImageUrls: string[];
}) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);

  const addImage = useCallback<ChangeEventHandler<HTMLInputElement>>(
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

          setImageUrls((imageUrls) => [...imageUrls, url]);
        }),
      );
    },
    [setImageUrls],
  );

  return (
    <Fragment>
      <header>
        <h1>Image Gallery</h1>
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
          onChange={addImage}
          accept="image/*"
        />
        <ul>
          {imageUrls.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
              >
                <img
                  src={url}
                  alt=""
                  height="250"
                />
              </a>
            </li>
          ))}
        </ul>
      </main>
    </Fragment>
  );
}

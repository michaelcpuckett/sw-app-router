import { GetStaticProps, Metadata } from 'app-router/index';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'Home',
};

export const getStaticProps: GetStaticProps = async function () {
  return {};
};

export default function HomePage() {
  return (
    <Fragment>
      <header>
        <h1>Service Worker with App Router Starter</h1>
      </header>
      <main>
        <a
          className="button"
          href="/files"
        >
          Upload Files
        </a>
        <a
          className="button"
          href="/notes"
        >
          Create Notes
        </a>
      </main>
    </Fragment>
  );
}

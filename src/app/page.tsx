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
        <h2>Examples</h2>
        <ul>
          <li>
            <a href="/notes">Notes</a>
            <ul>
              <li>Dynamic routing</li>
              <li>Saves notes to IndexedDB</li>
              <li>Notes can be reordered via LexoRank</li>
            </ul>
          </li>
          <li>
            <a href="/files">File Manager</a>
            <ul>
              <li>Saves files to browser cache</li>
              <li>Files can be downloaded</li>
            </ul>
          </li>
        </ul>
        <h2>Ideas</h2>
        <ul>
          <li>Blog with Markdown</li>
          <li>Sync with database via REST API</li>
        </ul>
      </main>
    </Fragment>
  );
}

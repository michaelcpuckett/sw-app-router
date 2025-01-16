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
        <a href="https://github.com/michaelcpuckett/sw-app-router-starter">
          GitHub
        </a>
      </header>
      <main>
        <h2>Overview</h2>
        <p>
          This is a starter project for building a multi-page web app inside a
          service worker.
        </p>
        <h2>Demos</h2>
        <ul>
          <li>
            <a href="/notes">Notes</a>
            <ul>
              <li>Saves notes to IndexedDB</li>
              <li>Dynamic routing to view each Note</li>
            </ul>
          </li>
          <li>
            <a href="/pokemon">Pokedex</a>
            <ul>
              <li>Connects to a third-party API</li>
              <li>Dynamic routing to view each Pokemon</li>
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
      </main>
    </Fragment>
  );
}

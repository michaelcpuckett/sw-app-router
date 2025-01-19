import { GetStaticProps, Metadata } from '@express-worker/router/types';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'Home',
};

export const getStaticProps: GetStaticProps = async function () {
  return {
    props: {},
  };
};

export default function HomePage() {
  return (
    <Fragment>
      <header>
        <h1>Service Worker with App Router Starter</h1>
        <a
          className="button"
          href="https://github.com/michaelcpuckett/sw-app-router-starter"
        >
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
            <a href="/notes">Markdown Editor</a>
            <ul>
              <li>Saves notes to IndexedDB</li>
              <li>Dynamic routing to view each note</li>
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
            <a href="/gallery">Image Gallery</a>
            <ul>
              <li>Saves image files to browser cache</li>
            </ul>
          </li>
        </ul>
      </main>
    </Fragment>
  );
}

# Service Worker with App Router Starter

This project demonstrates how to serve dynamic HTML with React inside a service
worker, providing functionality similar to Next.js.

## Features

- **Dynamic Routing**: Similar to Next.js, routes are defined in a directory
  structure and handled dynamically.
- **React SSR**: Uses React for rendering the initial HTML and for hydrating
  components on the client.
- **Static File Handling**: Static files are cached and served by the service
  worker.
- **"Serverless"**: Offloads dynamic HTML generation from the server to the
  client. Requires only a static file hosting provider (such as Firebase).

## Installation

1. Install dependencies

```sh
npm install
```

2. Run the `app-router` script to generate list of routes and static files.

```sh
npm run app-router
```

3. Build the project.

```sh
npm run build
```

4. Serve the project.

```sh
npm run serve
```

5. Open in the browser.

```sh
http://localhost:8080
```

## .app-router Directory

### `index.tsx`

This file serves static files and routes requests to the appropriate React
components, utilizing the underlying
[ExpressWorker](https://www.github.com/michaelcpuckett/express-worker)
framework.

### `client.tsx`

This file hydrates the React components on the client side using
`react-dom/client`.

### `PageShell.tsx`

This component wraps the rendered pages, injecting metadata and initial data
into the HTML.

### `prepare.ts`

This script generates the route and static files configuration required by the
service worker. It scans the app directory for pages and the dist directory for
static files.

## Usage

To add a new page:

1. Create a new folder in the `app` directory and create a `page.tsx` file
   inside it.

2. Define the React component for the page and export `getStaticProps` and
   `metadata`.

3. Run `npm run app-router` to regenerate the routes.

### Metadata

`metadata` is an object that contains information about the page, such as the
title, description, and other meta tags. You can define `metadata` as follows:

```ts
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

### `getStaticProps`

`getStaticProps` is a function used to fetch data at render time. It allows you
to fetch data from an API or database and pass it as props to the page
component. The path params are passed to this function. You can define
getStaticProps as follows:

```ts
export async function getStaticProps(params: Params) {
  const data = await fetchData({ id: params.id });

  return {
    data,
  };
}
```

## Debugging

Use `npm run serve` and `npm run watch` and in the Web Inspector, under the
Application tab, under Service Workers, select the checkbox for "Update on
reload".

## License

This project is licensed under the MIT License.

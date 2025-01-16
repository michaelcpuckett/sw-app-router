# Service Worker with App Router Starter

This project demonstrates how to serve dynamic HTML with React inside a service
worker. The user experience is similar to a multi-page app (MPA) and the
developer experience is similar to Next.js.

## Features

### App Router

Similar to Next.js, routes are defined as a directory structure under `src/app`.

Dynamic routes are defined by using square brackets in the folder name. For
example, if you want to create a dynamic route for user profiles, you can create
a folder with a path of `src/app/profiles/[id]`.

### React SSR

The initial page HTML is rendered by React-DOM/Server and gets hydrated by
React-DOM/Client.

### Static File Handling

Static files in the `dist` directory are cached and served by the service
worker.

### "Serverless"

Dynamic HTML generation is offloaded from the server to the client.

The server only needs to be able to serve the initial static files. This project
uses Firebase Static Hosting.

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

The `app-router` script generates the route and static files configuration
required by the service worker. It scans the app directory for pages and the
dist directory for static files.

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

### Page component

The `default` export should be the Page component. It will receive the props
defined in `getStaticProps`. It will be wrapped in the `PageShell`.

```tsx
export default function HomePage({ data }: { data: Data }) {
  return <main>{data.foo}</main>;
}
```

## Development

Use `npm run serve` and `npm run watch` during development.

For easiest debugging, in the Web Inspector, under the Application tab, under
Service Workers, select the checkbox for "Update on reload".

Styles can be edited directly in `dist/styles.css`.

## Production Builds

Use `npm run build` to generate a production build.

Update `dist/cache.json` with an incremented version number with each update. By
incrementing the version number, you ensure that the browser fetches the latest
versions of your files instead of using outdated cached versions.

## License

This project is licensed under the MIT License.

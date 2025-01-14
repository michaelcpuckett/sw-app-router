# SWAR (Service Worker with App Router) Starter

This project demonstrates how to serve dynamic HTML with React inside a service
worker, providing functionality similar to Next.js. The core functionality is
implemented in the `.app-router` directory.

## Features

- **Dynamic Routing**: Similar to Next.js, routes are defined in a directory
  structure and handled dynamically.
- **React SSR**: Uses React for rendering the initial HTML and for hydrating
  components on the client.
- **Static File Handling**: Static files are cached and served by the service
  worker.
- **"Serverless"**: Offload dynamic HTML generation from the server to the
  client.

## Installation

1. Install dependencies

```sh
npm install
```

1. Run the `prepare` script to generate list of routes and static files.

```sh
npm run prepare
```

1. Build the project.

```sh
npm run build
```

1. Serve the project.

```sh
npm run serve
```

1. Open `localhost:8080` in the browser.

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

1. Define the React component for the page and export `getStaticProps` and
   `metadata`.

1. Run `npm run prepare` to update the routes.

## License

This project is licensed under the MIT License.

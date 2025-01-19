import { version } from '.express-worker-router/cache.json';
import routesConfig from '.express-worker-router/routes';
import staticFiles from '.express-worker-router/static.json';
import { useAppRouter } from '@express-worker/router/service-worker';

useAppRouter({ routesConfig, staticFiles, version });

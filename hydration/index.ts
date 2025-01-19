import routesConfig from '.express-worker-router/routes';
import { useHydration } from '@express-worker/router/hydration';

useHydration({ routesConfig });

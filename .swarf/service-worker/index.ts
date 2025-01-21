import { version } from "../cache.json";
import routesConfig from "../routes/index";
import staticFiles from "../static.json";
import { useAppRouter } from "swarf/service-worker";

useAppRouter({ routesConfig, staticFiles, version });

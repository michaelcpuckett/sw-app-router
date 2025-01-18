import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

function getAppRoutes() {
  const routes: string[] = [];
  const appDir = path.resolve(__dirname, '../../src/app');

  function traverseDirectory(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.resolve(currentDir, file);

      if (fs.lstatSync(filePath).isDirectory()) {
        traverseDirectory(filePath);
      } else if (file.endsWith('.tsx')) {
        const pageName = path
          .relative(appDir, filePath)
          .replace(/\\/g, '/')
          .replace(/\.tsx$/, '');
        routes.push(`/${pageName}`);
      }
    });
  }

  traverseDirectory(appDir);
  return routes;
}

const toCamelCase = (string: string) => {
  return string.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

async function writeAppRoutesToFile() {
  try {
    const routes = getAppRoutes();
    const outputPath = path.resolve(__dirname, '../', 'routes.ts');

    fs.writeFileSync(
      outputPath,
      `const Routes: Record<string, any> = {};

      ${routes
        .map((route) => {
          const routeSlug = toCamelCase(
            route.replace(/\//g, '-').replace(/[\[\]]/g, ''),
          );

          return `
            import * as ${routeSlug} from 'app${route}';

            Routes['${
              route.replace('page', '').replace(/\/$/, '') || '/'
            }'] = ${routeSlug};
          `;
        })
        .join('\n')}
        
        export default Routes;
      `,
    );
    console.log(`✅ Routes generated successfully! See ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating routes:', error);
  }
}

function getStaticFiles() {
  return fs
    .readdirSync(path.resolve(__dirname, '../../', 'public'))
    .map((file) => {
      return '/' + file;
    });
}

function writeStaticFilesToFile() {
  try {
    const staticFiles = getStaticFiles();
    const outputPath = path.resolve(__dirname, '../', 'static.json');

    fs.writeFileSync(outputPath, JSON.stringify(staticFiles, null, 2));

    console.log(`✅ Static files generated successfully! See ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating static files:', error);
  }
}

try {
  writeAppRoutesToFile();
  writeStaticFilesToFile();
  exec(`cross-env NODE_ENV=production parcel build`, (error: unknown) => {
    if (error) {
      console.error(`❌ Error building project: ${error}`);
      return;
    }

    console.log(`✅ Project built successfully!`);
  });
} catch (error) {
  console.error('❌ Error building project:', error);
}

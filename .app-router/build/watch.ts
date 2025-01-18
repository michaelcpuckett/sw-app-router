import { exec } from 'child_process';

const watchScript = exec(`parcel watch`, (error: unknown) => {
  if (error) {
    console.error(`❌ Error building project: ${error}`);
    return;
  }

  console.log(`✅ Project built successfully!`);
});

const serveScript = exec(`http-server public -p 8080`, (error: unknown) => {
  if (error) {
    console.error(`❌ Error starting server: ${error}`);
    return;
  }

  console.log(`✅ Server started successfully!`);
});

watchScript.stdout?.on('error', (data) => {
  serveScript.kill();
  throw new Error('Build failed');
});

serveScript.stdout?.on('error', (data) => {
  watchScript.kill();
  throw new Error('Failed to start server');
});

serveScript.stdout?.pipe(process.stdout);
watchScript.stdout?.pipe(process.stdout);

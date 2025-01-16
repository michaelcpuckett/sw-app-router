window.navigator.serviceWorker
  .register('/app.js')
  .catch((error) => {
    throw new Error('Service worker registration failed: ' + error);
  })
  .then(async (registration) => {
    const serviceWorker =
      registration.installing || registration.waiting || registration.active;

    if (!serviceWorker) {
      throw new Error('Service worker not found.');
    }

    // Wait for service worker to activate.
    await new Promise((resolve) => {
      if (serviceWorker.state === 'activated') {
        resolve();
      } else {
        serviceWorker.addEventListener('statechange', (event) => {
          if (event.target.state === 'activated') {
            resolve();
          }
        });
      }
    });

    window.location.reload();
  })
  .catch((error) => {
    console.error(error);
  });

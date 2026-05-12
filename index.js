/**
 * Render and other deployment platforms often look for index.js as the default entry point.
 * This file redirects to server.js to ensure the application starts correctly.
 */
require('./server.js');

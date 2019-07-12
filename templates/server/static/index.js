/* eslint-disable global-require */
require('dotenv').config();
require('./globals');
const http = require('http');
const bootstrap = require('./bootstrap');
const { port } = require('./config');

//
// Bootstrapping components and Start server
// -----------------------------------------------------------------------------
bootstrap().then(() => {
  const server = http.createServer(require('./app'));

  server.listen(port, () => {
    global.log.info(`==> 🌎 Server listening on port ${port}`);
  });
})
  .catch((err) => {
    global.log.error(err);
    process.exit(1);
  });

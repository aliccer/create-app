const http = require('http');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const gzipCompression = require('compression');
const helmet = require('helmet');
const methodOverride = require('method-override');
const config = require('./config');
const { customResponse } = require('./middleware');
const apiRoutes = require('./api')();

const app = express();

//
// Register Middleware
// -----------------------------------------------------------------------------
if (config.isProduction) {
  // compress all responses https://www.npmjs.com/package/compression
  app.use(gzipCompression());
  // helps you secure your app https://www.npmjs.com/package/helmet
  app.use(helmet());
  // on production use 'build' directory
  app.use(express.static(path.resolve(__dirname, '..', 'build')));
} else {
  // on development use 'public' dir for serving static files
  app.use(express.static(path.resolve(__dirname, '..', 'public')));
}
// log HTTP requests https://www.npmjs.com/package/morgan
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
// parse the bodies of all incoming requests (application/json, application/x-www-form-urlencoded)
// https://www.npmjs.com/package/body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
// https://www.npmjs.com/package/method-override
// NOTE: you must fully parse the request body (call 'body-parser' module first)
//       before you call methodOverride() in your middleware stack,
//       otherwise req.body will not be populated.
app.use(methodOverride());
// standardized response
app.use(customResponse);

//
// Register routes
// -----------------------------------------------------------------------------
// Serve api routes
app.use('/api', apiRoutes);
// Always return the main index.html, so react-router render the route in the client
if (config.isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
  });
}

//
// Handle 'uncaughtException' event
// -----------------------------------------------------------------------------
process.on('uncaughtException', (err) => {
  global.log.error('uncaughtException: ', err);
  // send entire app down. Process manager will restart it
  process.exit(1);
});
//
// Handle 'unhandledRejection' event
// -----------------------------------------------------------------------------
process.on('unhandledRejection', (err) => {
  global.log.error('unhandledRejection: ', err);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

app.run = function runServer() {
  http.createServer(app).listen(config.port, () => {
    global.log.info(`==> 🌎 Server listening on port ${config.port}`);
  });
};


module.exports = app;

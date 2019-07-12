/* eslint-disable no-console */
const cluster = require('cluster');
const os = require('os');
const get = require('lodash/get');

module.exports = function startCluster(startWorker, options = {}) {
  const { logger, isDevelopment } = options;
  const cpus = os.cpus().length;
  const logInfo = typeof get(logger, 'info') === 'function' ? logger.info : console.log;
  const logError = typeof get(logger, 'error') === 'function' ? logger.error : console.error;

  if (cluster.isMaster && isDevelopment) {
    logInfo(`CPU count ${cpus}`);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cpus; i++) {
      const worker = cluster.fork().process;
      logInfo(`Worker started. Process id ${worker.pid}`);
    }

    cluster.on('exit', (worker) => {
      logError(`Worker ${worker.process.pid} died.`);
      const newWorker = cluster.fork().process;
      logInfo(`Worker started. Process id ${newWorker.pid}`);
    });
  } else {
    startWorker();
  }

  process.on('unhandledRejection', (reason, p) => {
    logError('Unhandled Rejection at:', p, 'reason:', reason);
    // send entire app down. Process manager will restart it
    process.exit(1);
  });
};

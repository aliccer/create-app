/* eslint-disable no-param-reassign */
const reduce = require('lodash/reduce');
const fs = require('fs-extra');
const path = require('path');

const { getDirectories } = require('../utils');

const packageJsonConfig = {
  scripts: {
    server: "node './server/index.js'",
    'debug:server': 'nodemon --inspect server',
  },
  dependencies: {
    cors: '^2.8.5',
    dotenv: '^6.0.0',
    express: '^4.16.4',
    'express-validator': '^5.3.0',
    helmet: '^3.13.0',
    'method-override': '^3.0.0',
    morgan: '^1.9.1',
    nodemon: '^1.18.7',
  },
  engines: {
    node: '>=12.4.X',
    npm: '>=6.9.X',
  },
};

const SERVER_DIR = 'server';

module.exports = ({
  appDir,
  userOptions,
}) => {
  // copy static files
  fs.copySync(
    path.resolve(__dirname, '../templates/server/static'),
    path.join(appDir, SERVER_DIR),
  );

  const useExample = reduce({
    Default: userOptions.examples,
    WithMongodb: userOptions.examples && userOptions.mongodb,
  },
  (res, v, k) => {
    if (v === true) {
      res = k;
    }
    return res;
  }, '');

  // add MongoDB if user confirmed installation
  if (userOptions.mongodb) {
    fs.copySync(
      path.resolve(__dirname, '../templates/server/mongodb'),
      path.join(appDir, SERVER_DIR),
      { overwrite: true },
    );
  }

  // add examples if required
  if (useExample) {
    const pathToExample = path.resolve(__dirname, `../templates/server/examples/${useExample}`);
    const dirList = getDirectories(pathToExample);

    dirList.forEach((dir) => {
      const destination = path.join(...dir.split('_'));

      fs.copySync(
        path.join(pathToExample, dir),
        path.join(appDir, SERVER_DIR, destination),
        { overwrite: true },
      );
    });
  }

  return {
    packageJsonConfig,
  };
};

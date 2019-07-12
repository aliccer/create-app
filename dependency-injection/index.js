/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const reduce = require('lodash/reduce');
const sortBy = require('lodash/sortBy');
const pick = require('lodash/pick');
const merge = require('lodash/merge');
const get = require('lodash/get');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const { getScripts } = require('../utils');

const packageJsonConfig = {
  version: '0.0.1',
  private: true,
  dependencies: {
    axios: '^0.18.0',
    lodash: '^4.17.11',
    normalizr: '^3.3.0',
    humps: '^2.0.1',
  },
  devDependencies: {
    'babel-eslint': '9.0.0',
    concurrently: '^4.1.0',
    eslint: '5.12.0',
    'eslint-config-airbnb': '^17.1.0',
    'eslint-config-react-app': '^3.0.8',
    'eslint-plugin-flowtype': '2.50.1',
    'eslint-plugin-import': '^2.17.2',
    'eslint-plugin-jsx-a11y': '^6.2.1',
    'eslint-plugin-react': '^7.12.4',
    nodemon: '^1.18.11',
    tslint: '^5.16.0',
    typescript: '^3.4.4',
  },
  proxy: 'http://localhost:8000',
};

const packageJsonKeysOrder = {
  name: 0,
  version: 1,
  private: 2,
  scripts: 3,
  dependencies: 4,
  devDependencies: 5,
};

function getConfirmedComponents(userOptions) {
  const availableComponents = [
    'server',
    'client',
    'mongodb',
    'redux',
    'examples',
  ];

  return reduce(pick(userOptions, availableComponents), (a, v, k) => {
    if (v === true) {
      a.push(k);
    }
    return a;
  }, []);
}


module.exports = ({
  appDir,
  appName,
  userOptions,
} = {}) => {
  const confirmedComponents = getConfirmedComponents(userOptions);

  const components = getScripts(__dirname);
  const availableComponents = components.filter((file) => {
    const filename = file.split('.').slice(0, -1).join('.');
    return confirmedComponents.indexOf(filename) !== -1;
  });

  let packageJson = merge(
    packageJsonConfig,
    {
      name: appName,
    },
    fs.readJsonSync(
      path.join(appDir, 'package.json'),
      { throws: false },
    ),
  );

  const orderedPackageJson = {};

  sortBy(Object.keys(packageJson), key => packageJsonKeysOrder[key])
    .forEach((key) => {
      orderedPackageJson[key] = packageJson[key];
    });

  packageJson = orderedPackageJson;

  if (userOptions.client && userOptions.server) {
    packageJson.scripts.start = 'concurrently "react-scripts start" "node server"';
  }

  availableComponents.forEach((file) => {
    const src = path.join(__dirname, file);
    const component = require(src)({ appDir, userOptions });

    merge(packageJson, get(component, 'packageJsonConfig', null));
  });

  // add package.json
  fs.writeFileSync(
    path.join(appDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );
};

const reduce = require('lodash/reduce');
const fs = require('fs-extra');
const path = require('path');

const packageJsonConfig = {
  scripts: {
    client: 'react-scripts start',
  },
  dependencies: {
    classnames: '^2.2.6',
    'prop-types': '^15.7.2',
    'react-router-dom': '^4.3.1',
  },
};

const CLIENT_DIR = 'src';
module.exports = ({
  appDir,
  userOptions,
}) => {
  // copy static files
  fs.copySync(
    path.resolve(__dirname, '../templates/client/static'),
    path.join(appDir, CLIENT_DIR), {
      overwrite: true,
    },
  );

  const useExample = reduce({
    Default: userOptions.examples,
    ReactRedux: userOptions.examples && userOptions.redux,
    ReactReduxAPI: userOptions.examples && userOptions.redux && userOptions.server,
  },
  (res, v, k) => {
    if (v === true) {
      // eslint-disable-next-line no-param-reassign
      res = k;
    }
    return res;
  }, '');

  // add Redux if user confirmed installation
  if (userOptions.redux) {
    fs.copySync(
      path.resolve(__dirname, '../templates/client/reduxDependencies'),
      path.join(appDir, CLIENT_DIR), {
        overwrite: true,
      },
    );
  }

  // add examples if required
  if (useExample) {
    const pathToExample = path.resolve(__dirname, `../templates/client/examples/${useExample}`);
    const fullClientPath = path.join(appDir, CLIENT_DIR);

    fs.copySync(
      pathToExample,
      fullClientPath, {
        overwrite: true,
      },
    );
    if (useExample === 'Default') {
      if (userOptions.server) {
        fs.unlinkSync(path.join(fullClientPath, 'containers', 'TodoApp.jsx'));
        fs.renameSync(
          path.join(fullClientPath, 'containers', 'TodoAppWithApi.jsx'),
          path.join(fullClientPath, 'containers', 'TodoApp.jsx'),
        );
      } else {
        fs.unlinkSync(path.join(fullClientPath, 'containers', 'TodoAppWithApi.jsx'));
      }
    }
  }

  return {
    packageJsonConfig,
  };
};

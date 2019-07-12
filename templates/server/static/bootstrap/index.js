/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */


const fs = require('fs');
const path = require('path');

module.exports = () => {
  const tasks = [];
  const components = fs.readdirSync(__dirname).filter((file) => {
    if (file.indexOf('index') !== -1 || path.extname(file) !== '.js') return false;
    const src = path.join(__dirname, file);
    return fs.statSync(src).isFile();
  });

  components.forEach((component) => {
    const src = path.join(__dirname, component);
    const promise = require(src);

    tasks.push(promise);
  });

  return Promise.all(tasks);
};

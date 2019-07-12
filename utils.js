const path = require('path');
const fs = require('fs-extra');

const getScripts = (_path) => fs.readdirSync(_path).filter((file) => {
  if (file.indexOf('index') !== -1 || path.extname(file) !== '.js') return false;
  const src = path.join(_path, file);
  return fs.statSync(src).isFile();
});

function printError(error, exit = false) {
  if (typeof error == 'object' && error !== null && error.message) {
    error = error.message;
  }
  if (typeof error === 'string') {  
    console.error(chalk.red(error));

    if (exit === true) {
      process.exit(1);
    }
  }
}

const getDirectories = (_path) => fs.readdirSync(_path).filter((file) => {
  const src = path.join(_path, file);
  return fs.statSync(src).isDirectory();
});

module.exports = {
  getScripts,
  getDirectories,
  printError
};
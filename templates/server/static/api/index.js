/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/**
 * route producer
 */
const fs = require('fs');
const path = require('path');
const router = require('express').Router();


module.exports = () => {
  const routes = fs.readdirSync(__dirname).filter((file) => {
    const src = path.join(__dirname, file);
    return fs.statSync(src).isDirectory();
  });

  routes.forEach((route) => {
    const src = path.join(__dirname, route);
    require(src)(router);
  });

  // Not Found 404
  router.use('*', (req, res) => res.status(404).send());

  return router;
};

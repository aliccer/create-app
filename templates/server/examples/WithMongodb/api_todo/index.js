const controller = require('./todo.controller');
const validation = require('./todo.validation');


module.exports = (router) => {
  router.route('/todos')
    .get(controller.list)
    .post(validation.onCreate, controller.create)
    .delete(validation.onDelete, controller.delete);

  router.route('/todos/:id')
    .put(validation.onUpdate, controller.update);
};

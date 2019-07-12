const uniqueId = require('lodash/uniqueId');
const find = require('lodash/find');
const filter = require('lodash/filter');

let TODO_STORE = [{
  _id: uniqueId(),
  completed: false,
  text: 'some other todos',
  createdAt: '2018-12-19T11:01:42.039Z',
},
{
  _id: uniqueId(),
  completed: false,
  text: 'changed todo',
  createdAt: '2018-12-19T11:01:35.773Z',
},
];
//
// Get all todos sorted by date
// -----------------------------------------------------------------------------
exports.list = (req, res) => {
  res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, TODO_STORE);
};

//
// Create todo
// -----------------------------------------------------------------------------
exports.create = (req, res) => {
  const todo = {
    _id: uniqueId(),
    completed: false,
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  TODO_STORE.unshift(todo);

  res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, todo);
};

//
// Update todo by ID
// -----------------------------------------------------------------------------
exports.update = (req, res) => {
  const { id } = req.params;

  const todo = find(TODO_STORE, ['_id', id]);

  if (todo) {
    res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, todo);
  } else {
    res.sendError(CONSTANTS.HTTP_CODES.NOT_FOUND, CONSTANTS.MESSAGES.ENTITY_NOT_FOUND);
  }
};

//
// Delete todos by its IDs
// -----------------------------------------------------------------------------
exports.delete = (req, res) => {
  const { ids } = req.body;

  TODO_STORE = filter(TODO_STORE, todo => ids.indexOf(todo._id) === -1);

  res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, {
    deleted: true,
  });
};

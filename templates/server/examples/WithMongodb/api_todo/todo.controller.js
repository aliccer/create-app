const TodoModel = require('./todo.model');


//
// Get all todos sorted by date
// -----------------------------------------------------------------------------
exports.list = (_, res) => {
  TodoModel.find({}, { __v: 0 }).sort({ createdAt: -1 }).lean().exec((err, list) => {
    if (err) {
      global.log.error(err);
      res.sendError(
        CONSTANTS.HTTP_CODES.UNPROCESSABLE_ENTITY,
        CONSTANTS.MESSAGES.UNABLE_TO_PROCESS,
      );
    } else {
      res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, list);
    }
  });
};

//
// Create todo
// -----------------------------------------------------------------------------
exports.create = (req, res) => {
  new TodoModel(req.body).save((err, item) => {
    if (err) {
      global.log.error(err);
      res.sendError(
        CONSTANTS.HTTP_CODES.UNPROCESSABLE_ENTITY,
        CONSTANTS.MESSAGES.UNABLE_TO_PROCESS,
      );
    } else {
      res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, item);
    }
  });
};

//
// Update todo by ID
// -----------------------------------------------------------------------------
exports.update = (req, res) => {
  const { id } = req.params;

  TodoModel.findByIdAndUpdate(id, { $set: req.body }, { new: true, select: '-__v' }).exec((err, item) => {
    if (err) {
      global.log.error(err);
      res.sendError(
        CONSTANTS.HTTP_CODES.UNPROCESSABLE_ENTITY,
        CONSTANTS.MESSAGES.UNABLE_TO_PROCESS,
      );
    } else {
      res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, item);
    }
  });
};

//
// Delete todos by its IDs
// -----------------------------------------------------------------------------
exports.delete = (req, res) => {
  const { ids } = req.body;

  TodoModel.deleteMany({ _id: { $in: ids } }).lean().exec((err) => {
    if (err) {
      global.log.error(err);
      res.sendError(
        CONSTANTS.HTTP_CODES.UNPROCESSABLE_ENTITY,
        CONSTANTS.MESSAGES.UNABLE_TO_PROCESS,
      );
    } else {
      res.sendSuccess(CONSTANTS.HTTP_CODES.SUCCESS, {
        ids,
        deleted: true,
      });
    }
  });
};

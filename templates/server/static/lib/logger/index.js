/* eslint-disable no-undef */
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const get = require('lodash/get');
const Datadog = require('./datadog');


function Logger(name, options = {}) {
  if (typeof name !== 'string') {
    throw new Error('logger name must be defined');
  }

  if (!(this instanceof Logger)) {
    return new Logger(name, options);
  }

  if (Logger[name] instanceof Logger) {
    return Logger[name];
  }

  Logger[name] = this;

  const config = {
    defaultLevel: 'error',
    showHidden: false,
    format: '[%level][%pid][%file:%line][%time] - %message',
    ...options,
    color: {
      error: chalk.red.bold,
      warning: chalk.magenta,
      info: chalk.green,
      debug: chalk.yellow,
      trace: chalk.blue,
    },
  };

  const datadog = new Datadog(get(config, 'datadog'));

  function timestamp() {
    return new Date().toUTCString();
  }

  function combineArguments(args) {
    let message = ' ';

    if (!Array.isArray(args)) {
      throw TypeError('args required.');
    }

    args.forEach((element) => {
      if (element instanceof Error) {
        message += `${element.message}\n${element.stack}`;
      } else if (typeof element !== 'string') {
        message += `${util.inspect(element, { showHidden: config.showHidden, depth: null })} `;
      } else {
        message += `${element} `;
      }
    });

    return message;
  }

  function formatMessage(message, {
    level,
    __filename__: filename,
    __line__: line,
    __func__: func,
  }) {
    return config.format
      .replace(/%level/g, level.toUpperCase())
      .replace(/%file/g, filename)
      .replace(/%func/g, func)
      .replace(/%line/g, line)
      .replace(/%time/g, timestamp())
      .replace(/%message/g, message)
      .replace(/%pid/g, `pid-${process.pid.toString()}`);
  }

  function print(level, message) {
    const {
      color,
      defaultLevel = 'error',
    } = config;

    global.console.log(color[level || defaultLevel](message));
  }

  function actions(level, message) {
    return {
      send: (title, tags) => datadog.send({
        alert_type: level,
        text: message,
        title,
        tags,
      }),
    };
  }

  //
  // Public API
  // -----------------------------------------------------------------------------
  return {
    error(...args) {
      const level = 'error';
      let message = combineArguments(args);

      message = formatMessage(message, {
        level,
        __filename__,
        __line__,
        __func__,
      });

      print(level, message);

      return actions(level, message);
    },

    warn(...args) {
      const level = 'warning';

      let message = combineArguments(args);

      message = formatMessage(message, {
        level,
        __filename__,
        __line__,
        __func__,
      });

      print(level, message);

      return actions(level, message);
    },

    info(...args) {
      const level = 'info';

      let message = combineArguments(args);

      message = formatMessage(message, {
        level,
        __filename__,
        __line__,
        __func__,
      });

      print(level, message);

      return actions(level, message);
    },

    debug(...args) {
      const level = 'debug';

      let message = combineArguments(args);

      message = formatMessage(message, {
        level,
        __filename__,
        __line__,
        __func__,
      });

      print(level, message);
    },

    trace(...args) {
      const level = 'trace';

      let message = combineArguments(args);

      message = formatMessage(message, {
        level,
        __filename__,
        __line__,
        __func__,
      });

      print(level, message);
    },
  };
}


Object.defineProperty(global, '__stack__', {
  get() {
    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    Error.captureStackTrace(err, arguments.callee) // eslint-disable-line
    const { stack } = err;
    Error.prepareStackTrace = orig;
    return stack;
  },
});

Object.defineProperty(global, '__line__', {
  get() {
    return __stack__[2].getLineNumber() // eslint-disable-line
  },
});

Object.defineProperty(global, '__func__', {
  get() {
    return __stack__[2].getFunctionName() // eslint-disable-line
  },
});

Object.defineProperty(global, '__filename__', {
  get() {
    const rootPath = path.dirname(require.main.filename || process.mainModule.filename);
    return __stack__[2].getFileName().replace(rootPath, '') // eslint-disable-line
  },
});


module.exports = Logger;

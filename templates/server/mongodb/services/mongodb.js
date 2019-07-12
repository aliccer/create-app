const mongoose = require('mongoose');

const Database = (function IIFE() {
  class Singleton {
    constructor({ uri, options } = {}, logger = {}) {
      const {
        logError = global.console.error,
        logSuccess = global.console.info,
      } = logger;

      this.uri = uri;
      this.options = options;
      this.logError = logError;
      this.logSuccess = logSuccess;
      this.ObjectId = mongoose.Types.ObjectId;


      // If the Node process ends, close the Mongoose connection
      process.on('SIGINT', () => {
        mongoose.connection.close(() => {
          this.logError('Mongoose default connection disconnected through app termination');
          process.exit(0);
        });
      });
    }

    connect() {
      return new Promise((resolve, reject) => {
        if (typeof this.uri !== 'string') {
          reject(new Error("Mongodb error. URI doesn't provided!"));
        }

        mongoose.connect(this.uri, this.options);

        // Events
        mongoose.connection
          .on('error', (err) => {
            this.logError('Mongodb error occurred. ', err.toString());
            reject(err);
          })
          .on('connected', () => {
            this.logSuccess('Mongodb connection established');
            const conn = mongoose.connection;

            this.connection = mongoose.connection;
            this.collection = conn.collection.bind(conn);

            resolve(conn);
          });
      });
    }
  }

  let instance;

  return {
    connect(...options) {
      return new Promise((resolve, reject) => {
        if (instance === undefined) {
          instance = new Singleton(...options);
          instance.connect().then(resolve).catch(reject);
        } else {
          resolve(instance.connection);
        }
      });
    },

    getInstance() {
      if (instance === undefined) {
        throw new Error("MongoDB doesn't connected!");
      }
      return instance;
    },
  };
}());


module.exports = Database;

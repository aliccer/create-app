module.exports = {
  mongodb: {
    uri: 'mongodb://localhost:27017/mern-db',
    options: {
      useNewUrlParser: true,
      useFindAndModify: false,
      autoReconnect: true,
      reconnectTries: 1000,
      connectTimeoutMS: 30000,
      keepAlive: 1,
    },
  },
};

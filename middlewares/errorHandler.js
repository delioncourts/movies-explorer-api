const { ERROR_SERVER } = require('../utils/const');

// централизованный обработчик ошибок
module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
  next();
};

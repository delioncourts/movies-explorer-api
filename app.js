require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { ERROR_SERVER } = require('./utils/const');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001, DATABASE = 'mongodb://localhost:27017/moviesdb' } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(requestLogger); // подключаем логгер запросов
app.use(cors());

app.use((req, res, next) => {
  next(new NotFoundError('К сожалению, запращиваемый ресурс не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = ERROR_SERVER, message } = err;
  const errorMessage = (statusCode === ERROR_SERVER) ? 'Ошибка на сервере' : message;
  res.status(statusCode).send({ message: errorMessage });
  next();
});

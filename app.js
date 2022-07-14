require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes/index');
const limiter = require('./utils/rateLimiter');

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/moviesdb' } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(limiter);
app.use(helmet());
app.use(requestLogger); // подключаем логгер запросов
app.use(cors());

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

mongoose.connect(DATABASE);

app.listen(PORT);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError('Неверная почта или пароль')));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => next(err));
};

const createUsers = (req, res, next) => {
  const { email, password, name } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.send({ email, name }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Данный email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные пользователя'));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Данный email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Некорректные данные пользователя'));
      }
      return next(err);
    });
};

module.exports = {
  login, createUsers, updateUser, getCurrentUser,
};

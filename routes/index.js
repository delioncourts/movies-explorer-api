const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');

const entry = require('/entry');
const auth = require('../middlewares/auth');

router.use(entry);
router.use(auth);

router.use(require('./users'));
router.use(require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));
module.exports = router;
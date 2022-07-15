const router = require('express').Router();

const { login, createUsers } = require('../controllers/users');
const { validateLogin, validateRegister } = require('../utils/validation');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUsers);

module.exports = router;

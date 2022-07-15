const router = require('express').Router();

const { updateUser, getCurrentUser } = require('../controllers/users');
const { validateUpdateUser } = require('../utils/validation');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUpdateUser, updateUser);

module.exports = router;

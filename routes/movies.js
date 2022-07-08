const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { validateCreateMovie, validateDeleteMovie } = require('../utils/validation');

router.get('/movies', getMovies);
router.post('/movies', validateCreateMovie, createMovie);
router.delete('movies/:_id', validateDeleteMovie, deleteMovie);

module.exports = router;

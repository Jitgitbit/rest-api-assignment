const { Router } = require('express')
const router = new Router()
const { Movie } = require(`./model`);
const db = require(`../db`);

router.get('/movies', (req, res, next) => {
  Movie.findAll()
    .then(movies => {
      res.send(movies);
    })
    .catch(err => next(err))
});

router.get('/movies/:id', (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      res.json(movie); 
    })
    .catch(err => next(err))
});

router.post(`/movies`, (req, res, next) => {
  console.log(req.body)
  Movie.create(req.body)
    .then(movie => {
      res.send(movie);
    })
    .catch(err => next(err))
})

router.put(
  '/movies/:id',
  (request, response, next) => Movie
    .findByPk(request.params.id)
    .then(movie => movie.update(request.body))
    .then(movie => response.send(movie))
    .catch(next)
)

router.delete(
  '/movies/:id',
  (request, response, next) => Movie
    .destroy({ where: { id: request.params.id }})
    .then(number => response.send({ number }))
    .catch(next)
)

module.exports = router
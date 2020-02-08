const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const port = process.env.PORT || 4000;
const app = express();
const db = new Sequelize(`postgres://postgres:secret@localhost:5432/postgres`);
// const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:secret@localhost:5432/postgres";
const { Router } = require("express");
const router = new Router();
app.use(bodyParser.json());
app.use(router);

const Movie = sequelize.define(`Movie`, {
  title: Sequelize.TEXT,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.TEXT
});

// db.sync({force: true }) // to overwrite!
db
  .sync()
  .then(() => console.log(`Tables created`))
  .catch(err => {
    console.error(`Table schema fail`, err);
    process.exit(1);
  })
  .then(() => {
    const movies = [
      {
        title: `Top Gun`,
        yearOfRelease: 1985,
        synopsis:
          `Eighties flic`
      },
      {
        title: `Casino`,
        yearOfRelease: 1996,      // Persistent HARDCODED
        synopsis:
          `Maffia flic`
      },
      {
        title: `The dark knight`,
        yearOfRelease: 1954,
        synopsis:
          `Vigilante flic`
      }
    ];
    const moviePromises = movies.map(movie => Movie.create(movie));
    return Promise.all(moviePromises);
  })
  .catch(console.error);


router.get(`/movies`, (req, res, next) => {
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;
  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ movies: result.rows, total: result.count }))
    .catch(error => next(error));
});

router.get(`/movies/:id`, (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(params => {
      res.send(params);
    })
    .catch(next);
});

router.post(`/movies/new`, (req, res, next) => {
  console.log("what is req.body", req.body);
  Movie.create(req.body)
    .then(movie => res.json(movie))
    .catch(next);
});

router.put(`/movies/:id`, (req, res, next) => {
  Movie.findByPk(req.params.id)
    .then(movie => {
      if (movie) {
        movie.update(req.body).then(movie => res.json(movie));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

router.delete(`/movies/delete/:id`, (req, res, next) => {
  res.send("DELETED"); 
  Movie.delete({
    where: {
      id: req.params.id
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

app.listen(port, () => console.log(`REST API listening on port ${port}!`));
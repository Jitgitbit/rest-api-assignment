const express = require(`express`);
const Sequelize = require(`sequelize`);
const bodyParser = require(`body-parser`);
const { Router } = require(`express`);

const port = process.env.PORT || 4000;
const db = new Sequelize(`postgres://postgres:secret@localhost:5432/postgres`);
// const databaseUrl = process.env.DATABASE_URL || `postgresql://postgres:secret@localhost:5432/postgres`;

const router = new Router();
const app = express();

app.use(bodyParser.json());
app.use(router);

const Movie = db.define( `Movie`, {
  title: Sequelize.TEXT,
  yearOfRelease: Sequelize.INTEGER,
  synopsis: Sequelize.TEXT,
});

// db.sync({force: true }) // to overwrite!

db.sync()
  .then(console.log(`db synced`))
  .then(hardCoded())
  .catch(err => {
    console.error(`Table schema fail`, err);
    process.exit(1);
  })
  .catch(console.error);


function hardCoded() {
  Movie.findAll()
    .then(data => {
      data.length === 0 && Promise.all ([     // Don't forget this!

          Movie.create({
            title: `Top Gun`,
            yearOfRelease: 1985,
            synopsis: `Eighties flic`
          }),
          Movie.create({
            title: `Casino`,
            yearOfRelease: 1996,      // Persistent, HARDCODED 
            synopsis: `Maffia flic`
          }),
          Movie.create({
            title: `The Dark Knight`,
            yearOfRelease: 2008,
            synopsis: `Vigilante flic`
          })

        ]);
    })
    .catch(console.error);
}
  
router.get(`/movies`, (req, res, next) => {
  const limit = req.query.limit || 4;
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

router.post(`/movies`, (req, res, next) => {
  console.log(`req.body is `, req.body)
  Movie.create(req.body)
    .then(movie => {
      res.json(movie);  // .send for strings, .json for data
    })
    .catch(err => next(err))
})

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

router.delete(`/movies/:id`, (req, res, next) => {
  res.send(`DELETED`); 
  Movie.destroy({
    where: {id: req.params.id}
  })
    .then(deletedOne => {
      if (deletedOne) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.listen(port, () => console.log(`REST API listening on port ${port}!`));
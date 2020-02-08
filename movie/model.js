const Sequelize = require('sequelize');
const db = require(`../sequelize-rest`);

const Movie = db.define(
  'Movie',
  {
    title: {
      type: Sequelize.STRING,
    },
    yearOfRelease: {
      type: Sequelize.INTEGER
    },
    synopsis: {
      type: Sequelize.STRING
    }
  }
)

module.exports = { Movie }
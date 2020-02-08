const express = require('express');
// const db = require(`./sequelize-rest`);
// const Movie = require(`./movie/model`);
const movieRouter = require(`./movie/router`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);

const app = express();
const corsMiddleware = cors()
const parserMiddleware = bodyParser.json()

const port = process.env.PORT || 3000;
const movies = [
  { id: 1, title: "To Kill a Mockingbird", yearOfRelease: 1988, synopsis: "Harper Lee" },
  { id: 2, title: "Harry Potter and the Sorcerer's Stone", yearOfRelease: 1981, synopsis: "J.K. Rowling" },
  { id: 3, title: "Pride and Prejudice", yearOfRelease: 1980, synopsis: "bla" },
]

app.use(corsMiddleware);  //sequence matters!
app.use(parserMiddleware);

app.use(movieRouter);

app.get('/', (req, res) => res.redirect('/movies'))
app.get('/movies', (req, res) => res.json({ data: movies }))
app.get('/movies/:movieId', (req, res) => {
const movieId = req.params.movieId
const movie = movies.find(b => b.id == movieId)
if (movie) {
    res.json(movie)
} else {
    res.status(404).end()
}
}) 

app.listen(port, () => {console.log(`Listening on :${port}`)});



  
  
  
  
  

  
  
  
const express = require('express');
// const db = require(`./db`);
// const Movie = require(`./movie/model`);
const movieRouter = require(`./movie/router`);
const bodyParser = require(`body-parser`);
const cors = require(`cors`);



const app = express();
const corsMiddleware = cors()
const parserMiddleware = bodyParser.json()


const port = process.env.PORT || 3000;

app.use(corsMiddleware);  //sequence matters!
app.use(parserMiddleware)

app.use(movieRouter);

app.post(`/messages`, (req, res, next) => {
  console.log(req.body)
  Movie.create(req.body)
    .then(movie => {
      res.send(movie);
    })
    .catch(err => next(err))
})

app.listen(port, () => {
    console.log(`Listening on :${port}`) 
  });

  
  
  
  
  
  

  
  
  
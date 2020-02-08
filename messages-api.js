const express = require(`express`);
const bodyParser = require(`body-parser`);

const jsonParser = bodyParser.json()
const app = express();

const port = process.env.PORT || 3000;

let request = 0;

const messageLimit = (req, res, next) => {

  if (request >= 5) {

    console.log(`Request limit reached`)
    
    res.status(429).json({
      message: `Too many requests`
    });
  } else {
    request++;
    next();
  }
  console.log(request , ` /5 messageLimit`);   // Yeah !!
};

app.use(messageLimit)
  .use(jsonParser)

  .post(`/messages`, (req, res) => {

    console.log(req.body.message);

    if (!req.body.message || req.body === ``) {
      res.status(400).json({
        message: `Bad request`
      });
      console.log(`Request failed`);
      return;
    } else {
      res.json({
        message: `This is the message that was sent`
      });
      console.log(`Request passed`);
    }
  })

app.listen(port, () => console.log(`Message api listening on port ${port}!`));
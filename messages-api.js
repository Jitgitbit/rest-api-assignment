const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const app = express();
const port = 3000;

let request = 0;
const messageLimit = (req, res, next) => {
  if (request > 5) {
    res.status(429).json({
      message: "Too Many Requests"
    });
  } else {
    request++;
    next();
  }
  console.log("test messageLimit", request);
};

app
  .use(messageLimit)
  .use(jsonParser)

  .post("/messages", (req, res) => {
    console.log(req.body.text);
    console.log(req.is('text/*'));  
    if (!req.body.text || req.body === "") {
      res.status(400).json({
        message: "Bad Request"
      });
      console.log("request failed");
      return;
    } else {
      res.json({
        message: `This is the message that was sent`
      });
      console.log("request passed");
    }
  })
  .listen(port, () => console.log(`Message api listening on port ${port}!`));
import * as db from './src/db/index.js';
import * as sr from './src/sr/index.js';
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;

const app = express();
const port = 3001;

db.init();
sr.init();

app.use(cors());

// Configuring body parser middleware
app.use(urlencoded({ extended: false }));
app.use(json());

app.post('/addSubscriber', (req, res) => {
    console.log(req.body)
    let data = req.body
    console.log(data)
    db.addUser(data).then(data => {
      res.json(data)
    }).catch(err => res.json(err))
    
});

app.post('/deleteSubscriber', (req, res) => {
  console.log(req.body)
  let email = req.body.email
  db.deleteUser(email).then(data => {
    res.json(data)
  }).catch(err => res.json(err))
  
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
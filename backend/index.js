import * as db from './db.js';
import * as sr from './sr.js';
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { urlencoded, json } = pkg;

const app = express();
const port = 3001;

// Start workers
db.init();
sr.init();

app.use(cors());

// Configuring body parser middleware
app.use(urlencoded({ extended: false }));
app.use(json());

app.post('/addSubscriber', (req, res) => {
  db.addUser(req.body).then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
    res.json(err)
  })
});

app.post('/deleteSubscriber', (req, res) => {
  db.deleteUser(req).then(data => {
    res.json(data)
  }).catch(err => res.json(err))
  
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
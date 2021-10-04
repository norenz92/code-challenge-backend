import * as db from './db.js';
import * as sr from './sr.js';
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import https from 'https';
import fs from 'fs';
const { urlencoded, json } = pkg;

const app = express();
const port = 3000;

// Certificate
const privateKey1 = fs.readFileSync('/etc/letsencrypt/live/doro.adamnoren.se/privkey.pem', 'utf8');
const certificate1 = fs.readFileSync('/etc/letsencrypt/live/doro.adamnoren.se/cert.pem', 'utf8');
const ca1 = fs.readFileSync('/etc/letsencrypt/live/doro.adamnoren.se/chain.pem', 'utf8');
const credentials = {
	key: privateKey1,
	cert: certificate1,
	ca: ca1
};

const httpsServer = https.createServer(credentials, app);

// Start workers
db.init();
sr.init();

app.use(cors());

// Configuring body parser middleware
app.use(urlencoded({ extended: false }));
app.use(json());

// Route for adding subscribers
app.post('/addSubscriber', (req, res) => {
  db.addUser(req.body.email, req.body.area).then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
    res.json(err)
  })
});

// Route for deleting subscribers
app.post('/deleteSubscriber', (req, res) => {
  db.deleteUser(req.body.email).then(data => {
    res.json(data)
  }).catch(err => res.json(err))
  
});

// Start server
httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
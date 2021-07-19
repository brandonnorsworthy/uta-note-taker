const express = require('express');
const path = require('path');
const fs = require('fs')

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.post('/notes', (req, res) => {
  console.log(req.params)
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

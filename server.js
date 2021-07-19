const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
  console.log(`Hitting the API/Notes Route`);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    res.send(JSON.parse(data));
  })
})

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    let totalNotes = JSON.parse(data);
    let newNote = req.body;
    newNote.id = uuidv4();
    console.log(newNote);
    totalNotes.push(newNote);
    fs.writeFile("db/db.json", JSON.stringify(totalNotes), (err) => {
        if(err) throw err;
    })

    res.send(totalNotes);
  })
})

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    let totalNotes = JSON.parse(data);

    totalNotes.splice(req.params.id, 1);
    fs.writeFile("db/db.json", JSON.stringify(totalNotes), (err) => {
        if(err) throw err;
    })

    res.send(totalNotes);
  })
})

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
{
  console.log(`Listening at ${PORT}`);
})
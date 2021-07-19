const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080; //express syntax / heroku

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/notes", (req, res) => {
  console.log(`Hitting the API/Notes Route`);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    res.send(JSON.parse(data)); //send back the new json
  })
})

app.get('/notes', (req, res) => {
  console.log(`User is requesting the notes html file`);

  res.sendFile(path.join(__dirname, '/public/notes.html'))
}); //gets the notes.html files

//when user asks for the notes file
app.post("/api/notes", (req, res) => {
  console.log(`User creating new a new note`);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    let totalNotes = JSON.parse(data); // parse the json object to get ready to add to it
    let newNote = req.body; //go into the req and look at the payload
    newNote.id = uuidv4(); //generate new note id
    totalNotes.push(newNote); //push new note into object
    fs.writeFile("db/db.json", JSON.stringify(totalNotes), (err) => { //update the db json file with new content
        if(err) throw err;
    })

    res.send(totalNotes);
  })
})

//user clicks delete button function grabs the id sent in payload and finds it in the json file
app.delete("/api/notes/:id", (req, res) => {

  console.log(`Deleting based on ${req.params.id} from user`);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    let totalNotes = JSON.parse(data); // parse the json object to get ready to add to it

    totalNotes.splice(req.params.id, 1);
    fs.writeFile("db/db.json", JSON.stringify(totalNotes), (err) => {
        if(err) throw err;
    })

    res.send(totalNotes);
  })
})

//default to main index welcome screen
app.get('*', (req, res) => {
  console.log("Redirecting user to index, requested out of index/notes")
  res.sendFile(path.join(__dirname, '/public/index.html'))
});


app.listen(PORT, () =>
{
  console.log(`Listening at ${PORT}`);
})
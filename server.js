const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 2323;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4();
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  notes.push(newNote);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(notes));
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const notes = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')));
  const updatedNotes = notes.filter(note => note.id !== id);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(updatedNotes));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// I got some help with a family member on this page. I still don't understand what to do with db.json, but I feel like I have learned a lot from this assignment.
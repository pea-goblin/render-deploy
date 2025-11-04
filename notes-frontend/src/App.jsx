
import { useState, useEffect } from "react";
import Note from "./components/Note";
import axios from 'axios';
import noteService from "./services/note";
import Footer from "./components/footer";
import Notification from "./components/Notification";

function App() {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      });
  }, []);

  if (!notes) {
    return null;
  }
  const toggleImportantOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        console.log(">>", returnedNote);

        setNotes(notes.map(n => n.id === id ? returnedNote : n));
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' already delete from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        setNotes(notes.filter(n => n.id !== id))
      });
  };

  const notesToShow = showAll ? notes : notes.filter(n => n.important);
  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.9
    };

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("");
      })
      .catch(e => {
        setErrorMessage(`${e.response.data.error}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      < Notification
        message={errorMessage}
      />

      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportantOf={toggleImportantOf}
          />
        )}
      </ul>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Impotant" : "All"}
      </button>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit" > save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App


import { useState, useEffect } from "react";
import Note from "./components/Note";
import axios from 'axios';
import noteService from "./services/note";
import Footer from "./components/footer";
import Notification from "./components/Notification";
import loginService from "./services/login";

function App() {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUer] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      });
  }, []);

  useEffect(() => {
    const loggedNoteappUser = window.localStorage.getItem('loggedNoteappUser')

    if (loggedNoteappUser) {
      const user = JSON.parse(loggedNoteappUser);
      setUser(user);
      noteService.setToken(user.token);
    }
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("logging in with", username, password);
      const user = await loginService.login({ username, password });

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      );
      noteService.setToken(user.token);
      setUsername(user);
      setUsername('');
      setPassword('');
    } catch {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000)
    }
  }

  const LoginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label> username
          <input
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password <input
            type="text"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const noteForm = () => {
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNoteChange}
      />
      <button type="submit" > save</button>
    </form>
  }

  return (
    <div>
      <h1>Notes</h1>
      < Notification
        message={errorMessage}
      />

      <h2> Login</h2>
      {!user && LoginForm()}
      {user && (
        <div>
          <p> {user.name} Logged </p>
          {noteForm()}
        </div>
      )}
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "show Impotant" : "show All"}
      </button>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportantOf={toggleImportantOf}
          />
        )}
      </ul>


      <Footer />
    </div>
  )
}

export default App

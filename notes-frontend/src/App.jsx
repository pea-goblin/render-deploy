
import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import noteService from "./services/note";
import Footer from "./components/footer";
import Notification from "./components/Notification";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import NoteForm from "./components/NoteForm";

function App() {
  const [notes, setNotes] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const noteFormRef = useRef();

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

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
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

  const loginForm = () => {
    return (
      <Togglable
        buttonLabel="Login"
      >
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const noteForm = () => {
    return (
      <Togglable buttonLabel="new note" ref={noteFormRef}>
        <NoteForm
          createNote={addNote}
        />
      </Togglable>
    )
  }

  return (
    <div>
      <h1>Notes</h1>
      < Notification
        message={errorMessage}
      />
      <h2> Login</h2>
      {!user &&
        loginForm()
      }
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

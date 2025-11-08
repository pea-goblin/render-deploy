import { useState } from "react";

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('');

    const addNote = (event) => {
        event.preventDefault();

        createNote({
            content: newNote,
            important: Math.random() > 0.5
        });

        setNewNote("");
    }

    return (
        <div>
            <h2>Create a new note</h2>
            < form onSubmit={addNote} >
                <label >
                    content
                    <input
                        value={newNote}
                        onChange={event => setNewNote(event.target.value)}
                        placeholder="write note content here"
                        it="note-input"
                    />
                </label>
                <button type="submit" > save</button>
            </form >
        </div>
    )
}

export default NoteForm;
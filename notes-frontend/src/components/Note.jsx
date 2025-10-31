const Note = ({ note, toggleImportantOf }) => {

    const label = note.important
        ? "make unimpotant"
        : "make impotant";
    return (
        <li className="note">
            {note.id} {note.content}
            <button
                onClick={() => toggleImportantOf(note.id)}>{label}</button>
        </li>
    )
}

export default Note;
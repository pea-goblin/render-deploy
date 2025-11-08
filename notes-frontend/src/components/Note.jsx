const Note = ({ note, toggleImportantOf }) => {

    const label = note.important
        ? "make not important"
        : "make important";
    return (
        <li className="note">
            {note.id}
            {note.content}
            <button
                onClick={() => toggleImportantOf(note.id)}>{label}</button>
        </li>
    )
}

export default Note;
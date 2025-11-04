const Note = require('../models/note');

const initialNotes = [
    {
        content: 'HTML is easy',
        important: false
    },
    {
        content: 'Browser can execute only JavaScript',
        important: true
    }
]

// generate id of nonexising obj for test 404
const nonExistingId = async () => {
    const note = new Note({ content: "willremovethissoon" });
    await note.save();
    await note.deleteOne();
    return note._id.toString();
}

const notesInDb = async () => {
    const notes = await Note.find({});
    return notes.map(n => n.toJSON());
}

module.exports = {
    initialNotes, nonExistingId, notesInDb
}
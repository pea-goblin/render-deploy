const notesRouter = require("express").Router();
const Note = require('../models/note');

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({});
    res.json(notes);

});

notesRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const resultNote = await Note.findById(id);
    if (resultNote) {
        return res.json(resultNote);
    } else {
        return res.status(404).end();
    }
});

notesRouter.post("/", async (req, res, next) => {
    const body = req.body;
    const note = new Note({
        content: body.content,
        important: body.important || false
    });

    const noteSaved = await note.save();
    return res.status(201).json(noteSaved);
});

notesRouter.put("/:id", (req, res, next) => {
    const { content, important } = req.body;
    Note.findById(req.params.id)
        .then(note => {
            if (!note) {
                return res.status(404).send();
            }
            note.content = content;
            note.important = important;

            return note.save().then(n => {
                res.json(n);
            })
                .catch(e => next(e));
        })
});

notesRouter.delete("/:id", async (req, res, next) => {
    const id = req.params.id;
    await Note.findByIdAndDelete(id);
    return res.status(204).end();
});

module.exports = notesRouter;
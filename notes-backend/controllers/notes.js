const jwt = require('jsonwebtoken');
const notesRouter = require("express").Router();
const Note = require('../models/note');
const User = require('../models/user');

const getTokenFrom = req => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '');
    }
    return null;
}

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({})
        .populate('user', { username: 1, name: 1 });
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

notesRouter.post("/", async (req, res) => {
    const body = req.body;

    const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token invalid' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
        return res.status(400).json({ error: "userId missing or not valid" });
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: user._id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    return res.status(201).json(savedNote);
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
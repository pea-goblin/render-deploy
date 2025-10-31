const express = require("express");
const app = express();

app.use(express.static('dist'));


let notes = [
    { id: "1", content: "abc", important: true },
    { id: "2", content: "2abc", important: true },
    { id: "13", content: "3abc", important: true },
];
app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h1>Hello world</h1>");
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
    const id = req.params.id;

    const note = notes.find(it => it.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

const generateId = () => {
    const maxId = notes.length > 0 ?
        Math.max(...notes.map(it => Number(it.id))) : 0;
    return String(maxId + 1);
}


app.post("/api/notes", (req, res) => {
    const body = req.body;
    console.log(body);
    if (!body.content) {
        return res.status(400).json({
            error: "Content missing"
        });
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: body.important || false
    }

    notes.push(note);
    console.log(note);
    res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    notes = notes.filter(it => it.id !== id);
    res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});
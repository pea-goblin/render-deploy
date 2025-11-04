const { test, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper.test');

const Note = require('../models/note');

const api = supertest(app);

beforeEach(async () => {
    await Note.deleteMany({});
    await Note.insertMany(helper.initialNotes);
});

test.only(".get() expects to return connten-type json", async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});


test('test all notes are returned ', async () => {
    const response = await api.get('/api/notes');

    assert.strictEqual(response.body.length, 2);
});

test('test all notes are returned ', async () => {
    const response = await api.get('/api/notes');

    assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteExpected = notesAtStart[0];

    const returnedNote = await api
        .get(`/api/notes/${noteExpected.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    ;

    assert.deepStrictEqual(returnedNote.body, noteExpected);
});

test('a valid note can be added ', async () => {

    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const notesAtEnd = await helper.notesInDb();

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
    const contents = notesAtEnd.map(n => n.content);

    assert.strictEqual(contents.includes("async/await simplifies making async calls"), true);
})

test('note without content is not added', async () => {
    const newNote = {
        important: true
    }
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);
    const notesAtEnd = await helper.notesInDb();
    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
})

test("a note can be deleted", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204);

    const notesAtEnd = await helper.notesInDb();

    const contents = notesAtEnd.map(n => n.content);

    assert.strictEqual(contents.includes(noteToDelete.content), false);

    assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);

});


after(async () => {
    await mongoose.connection.close();
})

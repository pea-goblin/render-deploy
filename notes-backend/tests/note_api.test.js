const bcrypt = require("bcrypt");
const User = require('../models/user');

const { describe, test, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper.test');

const Note = require('../models/note');

const api = supertest(app);

describe('when there is initially come notes saved', () => {
    beforeEach(async () => {
        await Note.deleteMany({});
        await Note.insertMany(helper.initialNotes);
    });


    test.only(".get() expects to return conntent-type json", async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('test all notes are returned ', async () => {
        const response = await api.get('/api/notes');

        assert.strictEqual(response.body.length, helper.initialNotes.length);
    });



    describe('viewing a specific note', () => {
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

        test('faills with statuscode 400 id is invalid', async () => {
            const invalidId = "5a3d5da59070081a82a3445";

            await api.get(`/api/notes/${invalidId}`).expect(400);
        })
    })

    describe("additon of a new note", () => {
        test('a valid note can be added', async () => {
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

        test('fails with status code 400 if data invalid', async () => {
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

        describe("deletion of a node", () => {
            test("succeeds with  status code 204 if id is valid", async () => {
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
        });


        describe('when there is initially one user in db', () => {
            beforeEach(async () => {
                await User.deleteMany({});
                const passwordHash = await bcrypt.hash("123456", 10);
                const user = new User({ username: "root", passwordHash });
                await user.save();
            });

            test('creation succeeds with a fresh username', async () => {
                const usersAtStart = await helper.usersInDb();

                const newUser = {
                    username: "admin",
                    name: "James.T. Keva",
                    password: "1234"
                }

                await api.post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect("Content-Type", /application\/json/);

                const usersAtEnd = await helper.usersInDb();
                console.log(">> ", usersAtEnd.toString(), "-----------------");

                assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

                const usernames = usersAtEnd.map(u => u.name);
                assert.strictEqual(usernames.includes(newUser.end), true);
            });

            test('creation faild with proper statuscode and message if username already taken', async () => {

                const usersAtStart = await helper.usersInDb();
                const newUser = {
                    username: 'root',
                    name: "Superuser",
                    password: "qiqi",
                }

                const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)
                    .expect("Content-Type", /application\/json/)

                const usersAtEnd = await helper.usersInDb();

                assert.strictEqual(result.body.error.includes('expected `username` to be unique'), true);

                assert.strictEqual(usersAtEnd.length, usersAtStart.length);
            });
        });

    })
})


after(async () => {
    await mongoose.connection.close();
})

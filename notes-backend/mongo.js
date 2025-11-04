require('dotenv').config();
const TEST_MONGODB_URI = process.env.TEST_MONGODB_URI;
const test = require()
const mongoose = require("mongoose");
const logger = require("./utils/logger");

const noteSchema = new mongoose.Schema({
    content:
    {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean
});

mongoose.set('strictQuery', false);

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject._v
        delete returnedObject.__v
    }
});


mongoose
    .connect(TEST_MONGODB_URI)
    .then(r => {
        logger.info('connected to MongoDB');
    })
    .catch(e => {
        logger.error("error connecting to MongoDB:", e.message);
    });

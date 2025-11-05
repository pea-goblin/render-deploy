

const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method);
    console.log('Path: ', req.path);
    console.log('Body: ', req.body);
    console.log('---');
    next();
}

const unknownEnpoint = (req, res, next) => {
    res.status(404).json({ error: "Page is not exist" });
}

const errorHandler = (error, req, res, next) => {
    console.log("<<< error: ", error);
    if (error.name === "CastError") {
        return res.status(400).json({ error: 'malformatted id' });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    } else if (error.name === "MongoServerError" &&
        error.message.includes("E11000 duplicate key error")) {
        return res.status(400).json({ error: 'expected `username` to be unique' });
    }

    return res.status(500).json({ error: "server internal error!" });
}
module.exports = { errorHandler, unknownEnpoint, requestLogger };
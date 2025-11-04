

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
    if (error.name === "CastError") {
        return res.status(400).json({ error: 'malformatted id' });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    }


    return res.status(500).json({ error: "server internal error!" });
}
module.exports = { errorHandler, unknownEnpoint, requestLogger };
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/user");
const { info } = require("../utils/logger");

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: "Invalid username or password"
        });
    }

    const userForToken = {
        username: user.name,
        id: user.id
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET, { expiresIn: 60 * 60 });

    return res.status(200).json({
        token,
        username: user.username,
        name: user.name
    });
});

module.exports = router;
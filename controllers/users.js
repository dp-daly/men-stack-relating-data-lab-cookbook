const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get("/", async (req, res) => {
    const allUsersInDb = await User.find();
    res.render("users/index.ejs", {
        users: allUsersInDb,
    })
});

module.exports = router;

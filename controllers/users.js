const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get("/", async (req, res) => {
    const allUsersInDb = await User.find();
    res.render("users/index.ejs", {
        users: allUsersInDb,
    })
});

router.get("/:username", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    const clickedUser = await User.findOne( {username: req.params.username })
    res.render("show.ejs", {
        pantry: clickedUser.pantry,
    })
})

module.exports = router;

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    res.render('foods/index.ejs', {
        pantry: userInDb.pantry
    });
} catch(err) {
    return res.send(`There's an issue accessing your pantry from the database. See more details below: ${err.message}.`);
}
  });

router.get('/new', (req, res) => {
    res.render("foods/new.ejs")
})

router.post('/', async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.pantry.push(req.body);
    await userInDb.save();
    res.redirect("/users/:userId/foods");
    } catch(err) {
        return res.send(`There's an issue adding your item to the database. See more details below: ${err.message}.`);
    }
})

module.exports = router;

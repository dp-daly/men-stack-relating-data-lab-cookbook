const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

//Would it make sense to have made the currentUser and UserInDb variables global? Or do they need to be initialised during each action? 

router.get('/', async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    res.render('foods/index.ejs', {
        user: userInDb,
        pantry: userInDb.pantry,
    });
} catch(err) {
    return res.send(`There's an issue accessing your pantry from the database. See more details here: ${err.message}.`);
}
  });

router.get('/new', async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    res.render("foods/new.ejs", {
        user: userInDb,
    })
})

router.post('/', async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.pantry.push(req.body);
    await userInDb.save();
    res.redirect(`/users/${userInDb._id}/foods`);
    } catch(err) {
        return res.send(`There's an issue adding your item to the database. See more details here: ${err.message}.`);
    }
})

router.delete('/:itemId', async (req, res) => {
    try {
    const currentUser = req.session.user; 
    const userInDb = await User.findById(currentUser);
    const itemId = req.params.itemId;
    userInDb.pantry.pull({ _id: itemId });
    await userInDb.save();
    res.redirect(`/users/${userInDb._id}/foods`)
    } catch(err) {
        return res.send(`There's an issue finding and deleting the item in your database. See more details here: ${err.message}.`)
    }
})

router.get('/:itemId/edit', async (req, res) => {
    try {
    const currentUser = req.session.user; 
    const userInDb = await User.findById(currentUser);
    const currentFood = req.params.itemId;
    const foodInDb = await userInDb.pantry.find(food => food._id.toString() === currentFood);
    res.render("edit.ejs", {
        user: userInDb,
        item: foodInDb,
    })
} catch(err) {
    res.send(`There's an issue. See more details: ${err.message}`)
}
})

router.put('/:itemId/edit', async (req, res) => {
    try {
        const currentUser = req.session.user; 
        const userInDb = await User.findById(currentUser);
        const currentFood = req.params.itemId;
        await User.updateOne(
            { _id: userInDb._id, 'pantry._id': currentFood },
            { $set: { 'pantry.$.name': req.body.name } },
        );
    res.redirect(`/users/${userInDb._id}/foods`)
    } catch(err) {
        res.send(`There's an issue reaching the database. See more details: ${err.message}`)
    }
})


module.exports = router;

const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/User')

// for register
router.post('/register', async (req, res) => {
    try {
        const {username, email, password} = req.body;

        // generate hash password
        const salt = await bcrypt.genSalt(10);
        const hasspass = await bcrypt.hash(password, salt);

        const newUser = new User({
            username, email, password: hasspass
        });

        // save pass to db
        const user = await newUser.save();
        res.status(200).json(user)
        
    } catch (error) {
        res.status(500).json(error)
    }
});

// for login
router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        !user && res.status(400).json("Wrong username or password");

        // password validation
        const validPass = await bcrypt.compare(password, user.password);
        !validPass && res.status(400).json("Wrong username or password");

        res.status(200).json({_id: user._id, username: user.username});
        
    } catch (error) {
        res.status(500).json(error)
    }
});


module.exports = router;
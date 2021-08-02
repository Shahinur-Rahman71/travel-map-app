const router = require('express').Router();
const Pin = require('../models/Pin')

// post routes
router.post('/', async (req, res) => {
    const newPin = new Pin(req.body);

    try{
        const savePin = await newPin.save();
        res.status(200).json(savePin);

    } catch( err ) {
        res.status(500).json(err)
    }
});

// get routes
router.get('/', async (req, res) => {
    try {
        const getPins = await Pin.find();
        res.status(200).json(getPins);
        
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;
const {Schema, model} = require('mongoose');

const pinSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
        min: 3
    },
    desc: {
        type: String,
        require: true,
        min: 3
    },
    rating: {
        type: Number,
        require: true,
        min: 0,
        max: 5,
    },
    latitude: {
        type: Number,
        require: true
    },
    long: {
        type: Number,
        require: true
    }
}, {
    timestamps: true
});

module.exports = model('Pin', pinSchema);
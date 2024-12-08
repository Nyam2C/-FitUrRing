const mongoose = require('mongoose');

const food100Schema = new mongoose.Schema({
    food_id: {
        type: String,
        required: true,
        unique: true
    },
    food_name: {
        type: String,
        required: true
    },
    energy_kcal: {
        type: Number
    },
    carbohydrate: {
        type: Number
    },
    protein: {
        type: Number
    },
    fat: {
        type: Number
    },
    dietary_fiber: {
        type: Number
    },
    sugar: {
        type: Number
    },
    salt: {
        type: Number
    },
    vitamin: {
        type: String
    },
    mineral: {
        type: String
    }
}, {
    timestamps: true
});

const Food100 = mongoose.model('Food100', food100Schema);

module.exports = Food100;
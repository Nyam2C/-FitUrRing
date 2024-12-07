const mongoose = require('mongoose');

const food100Schema = new mongoose.Schema({
    food_id: {
        type: Number,
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
    carbs: {
        type: Number
    },
    protein: {
        type: Number
    },
    fat: {
        type: Number
    }
}, {
    timestamps: true
});

const Food100 = mongoose.model('Food100', food100Schema);

module.exports = { Food100 };
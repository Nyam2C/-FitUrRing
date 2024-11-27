const mongoose = require('mongoose');

const muscleSchema = new mongoose.Schema({
    muscle_id: {
        type: String,
        required: true,
        unique: true
    },
    muscle_name: {
        type: String,
        required: true
    },
    muscle_info: {
        type: String
    },
    muscle_tag: {
        type: String
    }
}, {
    timestamps: true
});

const Muscle = mongoose.model('Muscle', muscleSchema);

module.exports = { Muscle };
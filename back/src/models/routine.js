const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    routine_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    routine_name: {
        type: String,
        required: true
    },
    routine_created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const routineComponentSchema = new mongoose.Schema({
    component_id: {
        type: String,
        required: true,
        unique: true
    },
    routine_id: {
        type: String,
        required: true,
        ref: 'Routine'
    },
    video_id: {
        type: String,
        required: true,
        ref: 'Video'
    },
    component_sets: {
        type: Number,
        min: 0
    }
}, {
    timestamps: true
});

const Routine = mongoose.model('Routine', routineSchema);
const RoutineComponent = mongoose.model('RoutineComponent', routineComponentSchema);

module.exports = { Routine, RoutineComponent };
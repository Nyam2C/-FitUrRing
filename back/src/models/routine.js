const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    routine_name: {
        type: String,
        required: true
    },
    routine_exercises : [{
        video : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video',  // Videon참조
        }
    }]
    ,
    routine_created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


const Routine = mongoose.model('Routine', routineSchema);

module.exports = Routine;
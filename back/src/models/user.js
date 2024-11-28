const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20
    },
    user_password: {
        type: String,
        required: true,
        minlength: 6
    },
    user_name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    user_gender: {
        type: String,
        enum: ['male', 'female']
    },
    user_birth: {
        type: Date
    },
    user_email: {
        type: String,
        required: true,
        match: [/^.+@.+\..+$/, '올바른 이메일 형식이 아닙니다']
    },
    user_last_login: {
        type: Date
    }
}, {
    timestamps: { 
        createdAt: 'user_created_at',
        updatedAt: 'user_updated_at'
    }
});

const userAchievementSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    user_date: {
        type: Date,
        required: true
    },
    user_height: {
        type: Number,
        min: 0,
        max: 300
    },
    user_weight: {
        type: Number,
        min: 0,
        max: 500
    }
}, {
    timestamps: true
});

const userDietSchema = new mongoose.Schema({
    diet_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    diet_date: {
        type: Date,
        required: true
    },
    mealtime: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    food: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    }
}, {
    timestamps: true
});

// 모델 생성
const User = mongoose.model('User', userSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
const UserDiet = mongoose.model('UserDiet', userDietSchema);

module.exports = { User, UserAchievement, UserDiet };
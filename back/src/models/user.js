const mongoose = require('mongoose');

const dateOnly=function(date) {
    if(date){
        if (typeof date === 'string') {
            const [year, month, day] = date.split('-').map(Number);
            return new Date(year, month - 1, day);
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    return date;
};

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
        type: Date,
        set: dateOnly
    },
    user_email: {
        type: String,
        required: true,
        match: [/^.+@.+\..+$/, '올바른 이메일 형식이 아닙니다']
    },
    tokens: [{
        access_token: {
            type: String,
        },
        refresh_token: {
            type: String,
        },
        delete_token: {
            type: String
        },
        device_info: {
            ua: {
                type: String,
            },
            browser: {
                name: String,
                version: String
            },
            os: {
                name: String,
                version: String
            },
            device: {
                vendor: String,
                model: String,
                type: {
                    type: String,
                    default: 'desktop'
                }
            },
            ip: {
                type: String,
                required: true
            },
            last_login_at: {
                type: Date,
                default: Date.now
            },
            last_used: {
                type: Date,
                default: Date.now
            }
        }
    }],
    login_attempts: { 
        type: Number, 
        default: 0 
    },
    lock_until: { 
        type: Date 
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date,
        default: null
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
    achievements: [{
        date: {
            type: Date,
            required: true,
            set: function(date) {
                if(date){
                    const dayOfWeek = date.getDay();
                    const diff = date.getDate() - dayOfWeek;
                    date.setDate(diff);
                    date.setHours(0, 0, 0, 0);
                    return date;
                }
                return date;
            }
        },
        height: {
            type: Number,
            min: 0,
            max: 300
        },
        weight: {
            type: Number,
            min: 0,
            max: 500
        },
        goal_weight: {
            type: Number,
            min: 0,
            max: 500
        }
    }]
}, {
    timestamps: true
});

const userDietSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    diets: [{
        date: {
            type: Date,
            required: true,
            set: dateOnly
        },
        meals: {
            breakfast: [{
                food_id: {
                    type: String,
                    required: true,
                    ref: 'Food100'
                },
                grams: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }],
            lunch: [{
                food_id: {
                    type: String,
                    required: true,
                    ref: 'Food100'
                },
                grams: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }],
            dinner: [{
                food_id: {
                    type: String,
                    required: true,
                    ref: 'Food100'
                },
                grams: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }]
        }
    }]
}, {
    timestamps: true
});

// 인덱스 추가
userAchievementSchema.index({ user_id: 1, 'achievements.date': 1 });
userDietSchema.index({ user_id: 1, 'diets.date': 1 });
userDietSchema.index({ 'diets.meals.diet_id': 1 }, { unique: true });
userDietSchema.index({ 'diets.date': 1, 'diets.meals.mealtime': 1 }, { unique: true });

// 모델 생성
const User = mongoose.model('User', userSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
const UserDiet = mongoose.model('UserDiet', userDietSchema);

module.exports = { User, UserAchievement, UserDiet };
const mongoose = require('mongoose');

// KST로 날짜 변환하는 유틸리티 함수
const convertToKST = (date) => {
    if (!date) return date;
    const kstDate = new Date(date);
    kstDate.setHours(kstDate.getHours() + 9);
    return kstDate;
};

const dateOnly = function(date) {
    if(date){
        const kstDate = convertToKST(date);
        return new Date(kstDate.getFullYear(), kstDate.getMonth(), kstDate.getDate());
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
    tokens: {
        access_sessions: [{
            token_pair: {
                access_token: {
                    type: String,
                    required: true
                },
                refresh_token: {
                    type: String,
                    required: true
                }
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
        delete_sessions: [{
            delete_token: {
                type: String,
                required: true
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
        }]
    },
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
                    // KST로 변환하고 시간을 00:00:00으로 설정
                    const kstDate = convertToKST(date);
                    kstDate.setHours(0, 0, 0, 0);
                    return kstDate;
                }
                return date;
            },
            get: function(date) {
                return convertToKST(date);
            }
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
                },
                _id: false
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
                },
                _id: false
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
                },
                _id: false
            }]
        }
    }]
}, {
    timestamps: true
});

// 복합 인덱스 수정
userDietSchema.index({ user_id: 1, 'diets.date': 1 }, { unique: true });

// 인덱스 가
userAchievementSchema.index({ user_id: 1, 'achievements.date': 1 });

// 모델 생성
const User = mongoose.model('User', userSchema);
const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
const UserDiet = mongoose.model('UserDiet', userDietSchema);

module.exports = { User, UserAchievement, UserDiet };
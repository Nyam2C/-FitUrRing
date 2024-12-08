const {User, UserAchievement} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const emailService = require('../utils/emailService');

const SALT_ROUNDS=12;

const getAchievement = async (user_id, date = null) => {
    try {
        // 가장 최근 데이터 찾기
        const latestAchievement = await UserAchievement.findOne(
            { user_id },
            { achievements: { $slice: -1 } }
        );

        if (date) {
            const targetDate = new Date(date);
            targetDate.setUTCHours(0, 0, 0, 0);

            // 해당 날짜의 데이터 찾기
            const achievement = await UserAchievement.findOne(
                { 
                    user_id,
                    'achievements.date': {
                        $eq: targetDate
                    }
                },
                {
                    'achievements.$': 1
                }
            );

            if (achievement && achievement.achievements.length > 0) {
                return achievement.achievements[0];
            }

            // 해당 날짜의 데이터가 없으면, 그 이전의 가장 최근 데이터 사용
            if (latestAchievement && latestAchievement.achievements.length > 0) {
                const latestDate = new Date(latestAchievement.achievements[0].date);
                if (targetDate >= latestDate) {
                    return latestAchievement.achievements[0];
                }
            }
        }

        return {
            user_height: null,
            user_weight: null,
            goal_weight: null,
            date: date || null
        };
    } catch (error) {
        console.error('Error fetching achievement:', error);
        throw error;
    }
};

const isSameDay=(date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};

const userController = {
    hashPassword: async (user_password) => {
        return await bcrypt.hash(user_password,SALT_ROUNDS);
    },
    createUser: async (req, res) => {
        try {
            const {user_name, user_id, user_password, user_gender, user_email, user_birth} = req.body;
            const user = new User({
                user_name,
                user_id,
                user_password: await userController.hashPassword(user_password),
                user_gender: user_gender ? "female" : "male",
                user_email,
                user_birth,
                tokens: {
                    access_sessions: [],
                    delete_sessions: []
                }
            });
            await user.save();
            res.json({user_id: user.user_id, message: '회원가입이 완료되었습니다'});
        } catch(error) {
            if(error.code === 11000) res.status(400).json({message: '이미 존재하는 아이디입니다'});
            else res.status(500).json({message: `${error}`});
        }
    },
    signIn: async (req, res) => {
        try {
            const {user_id, user_password} = req.body;
            const user = await User.findOne({user_id: user_id});
            if(!user) {
                return res.status(400).json({
                    success: false,
                    message: '존재하지 않는 아이디입니다'
                });
            }
            if(user.is_deleted) {
                return res.status(400).json({
                    success: false,
                    message: '탈퇴 대기 중인 계정입니다'
                });
            }

            if(user.lock_until && user.lock_until > Date.now()){
                const remainingTime=Math.ceil((user.lock_until - Date.now())/1000);
                return res.status(429).json({
                    message: `계정이 잠겼습니다. ${remainingTime}초 후에 다시 시도해주세요.`,
                    remainingTime
                });
            }
            if (user.lock_until && user.lock_until <= Date.now()) {
                user.login_attempts = 0;
                user.lock_until = null;
                await user.save();
            }

            const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
            if(!isPasswordValid) {
                user.login_attempts++;
                if(user.login_attempts>=5){
                    user.lock_until=new Date(Date.now() + 5*60*1000);
                    await user.save();
                    return res.status(429).json({message: '비밀번호를 5회 이상 틀렸습니다. 5분 후에 다시 시도해주세요.'});
                }
                await user.save();
                return res.status(400).json({message: `비밀번호가 일치하지 않습니다. 남은 시도 횟수: ${5 - user.login_attempts}회`});
            }

            user.login_attempts = 0;
            user.lock_until = null;

            const userAgent = req.headers['user-agent'];
            const parser = new UAParser(userAgent);
            const result = parser.getResult();
            const clientIp = req.ip;
            
            const deviceInfo = {
                ua: userAgent,
                browser: {
                    name: result.browser.name ?? 'unknown',
                    version: result.browser.version ?? 'unknown'
                },
                os: {
                    name: result.os.name ?? 'unknown',
                    version: result.os.version ?? 'unknown'
                },
                device: {
                    vendor: result.device.vendor ?? 'unknown',
                    model: result.device.model ?? 'unknown',
                    type: result.device.type ?? 'desktop'
                },
                ip: clientIp,
                last_login_at: new Date(),
                last_used: new Date()
            };

            const refreshTokenFromCookie = req.cookies.refreshToken;
            let accessToken, refreshToken;

            if (refreshTokenFromCookie) {
                const existingSession = user.tokens?.access_sessions?.find(
                    session => session.token_pair.refresh_token === refreshTokenFromCookie
                );

                if (existingSession) {
                    refreshToken = refreshTokenFromCookie;
                    accessToken = jwt.sign({
                        type: 'ACCESS',
                        user_id: user.user_id,
                        deviceInfo: {
                            browser: deviceInfo.browser.name,
                            os: deviceInfo.os.name,
                            device: deviceInfo.device.type
                        }
                    },
                    process.env.JWT_ACCESS_SECRET,
                    { expiresIn: '1d' }
                    );

                    existingSession.token_pair.access_token = accessToken;
                    existingSession.device_info = deviceInfo;
                }
            }

            if (!refreshToken) {
                refreshToken = jwt.sign({
                    type: 'REFRESH',
                    user_id: user.user_id,
                    deviceInfo: {
                        browser: deviceInfo.browser.name,
                        os: deviceInfo.os.name,
                        device: deviceInfo.device.type
                    }
                },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '14d' }
                );

                accessToken = jwt.sign({
                    type: 'ACCESS',
                    user_id: user.user_id,
                    deviceInfo: {
                        browser: deviceInfo.browser.name,
                        os: deviceInfo.os.name,
                        device: deviceInfo.device.type
                    }
                },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '1h' }
                );

                const MAX_SESSIONS = 5;
                if (!user.tokens) {
                    user.tokens = {
                        access_sessions: [],
                        delete_sessions: []
                    };
                }

                if (user.tokens.access_sessions.length >= MAX_SESSIONS) {
                    user.tokens.access_sessions.sort((a, b) => 
                        new Date(a.device_info.last_used) - new Date(b.device_info.last_used)
                    );
                    user.tokens.access_sessions.shift();
                }

                user.tokens.access_sessions.push({
                    token_pair: {
                        access_token: accessToken,
                        refresh_token: refreshToken
                    },
                    device_info: deviceInfo
                });
            }

            await user.save();

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 14 * 24 * 60 * 60 * 1000,
                path: '/api'
            });

            res.json({
                message: 'signIn 성공',
                accessToken,
                user_id: user.user_id,
                user_name: user.user_name
            });
            
        } catch(error) {
            console.error('SignIn Error:', error);
            res.status(500).json({ message: error.message });
        }
    },
    signOut: async (req, res) => {
        try {
            const user_id = req.user.user_id;
            const accessToken = req.headers.authorization?.split(' ')[1];

            const result = await User.updateOne(
                { 
                    user_id,
                    'tokens.access_sessions': {
                        $elemMatch: {
                            'token_pair.access_token': accessToken
                        }
                    }
                },
                { 
                    $pull: { 
                        'tokens.access_sessions': { 
                            'token_pair.access_token': accessToken
                        }
                    }
                }
            );

            if(result.modifiedCount === 0) {
                return res.status(401).json({
                    success: false,
                    message: '유효하지 않은 세션입니다'
                });
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/api'
            });

            res.json({
                success: true,
                message: '로그아웃 되었습니다'
            });
        } catch(error) {
            console.error('SignOut Error:', error);
            res.status(500).json({
                success: false,
                message: '로그아웃 처리 중 오류가 발생했습니다'
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const {user_id, user_email, user_name, deviceInfo} = req.user;
            const user_password = req.body.user_password;

            const user = await User.findOne({
                user_id,
                is_deleted: false
            });
            
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다'
                });
            }

            const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
            if(!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: '비밀번호가 일치하지 않습니다'
                });
            }

            const deleteToken = jwt.sign({
                type: 'DELETE',
                user_id: user.user_id,
                deviceInfo: deviceInfo
            },
            process.env.JWT_DELETE_SECRET,
            { expiresIn: '24h' }
            );

            user.tokens.delete_sessions.push({
                delete_token: deleteToken,
                device_info: deviceInfo
            });
            user.tokens.access_sessions = [];
            user.is_deleted = true;
            user.deleted_at = new Date();
            await user.save();

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/api'
            });

            res.json({
                success: true,
                message: '회원탈퇴가 완료되었습니다. 확인 이메일을 확인해주세요.'
            });

            await emailService.sendDeleteConfirmation(user_email, user_id, user_name, deviceInfo, deleteToken);
        } catch(error) {
            res.status(500).json({
                success: false,
                message: '회원 탈퇴 처리 중 오류가 발생했습니다'
            });
        }
    },
    confirmHardDelete: async (req, res) => {
        try{
            const {user_id, user_name, user_email}=req.user;
            await User.deleteOne({ user_id: user_id });
            res.json({ message: `${user_id}님의 계정이 완전히 삭제되었습니다.` });
            await emailService.sendHardDelete(user_email, user_name);
        }catch(error){
            console.error(error);
            res.status(500).json({ message: '계정 삭제 중 오류가 발생했습니다.' });
        }
    },
    cancelHardDelete: async (req, res) => {
        try{
            const {user_id, user_name, user_email}=req.user;
            const user=await User.findOneAndUpdate(
                { user_id: user_id, is_deleted: true },
                { 
                    is_deleted: false,
                    tokens: {
                        access_sessions: [],
                        delete_sessions: []
                    }
                },
                { new: true }
            );

            if(!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            res.json({ message: `${user_id}님의 삭제가 취소되었습니다.` });
            await emailService.sendCancelDelete(user_email, user_name);
        }catch(error){
            console.error(error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    },
    getProfile: async (req, res) => {
        try {
            const user = await User.findOne({ user_id: req.user.user_id });
            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 가장 최근의 achievement 데이터 조회
            const latestAchievement = await UserAchievement.findOne(
                { user_id: req.user.user_id },
                { achievements: { $slice: -1 } }
            );

            const profileData = {
                user_id: user.user_id,
                user_name: user.user_name,
                user_gender: user.user_gender,
                user_birth: user.user_birth,
                user_email: user.user_email,
                user_created_at: user.user_created_at,
                user_height: latestAchievement?.achievements[0]?.user_height || null,
                user_weight: latestAchievement?.achievements[0]?.user_weight || null
            };

            res.json(profileData);
        } catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({ message: '프로필 조회 중 오류가 발생했습니다.' });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { user_name, user_password, user_email, user_height, user_weight } = req.body;
            const user = await User.findOne({ user_id: req.user.user_id });

            if (!user) {
                return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // 기본 사용자 정보 업데이트
            if (user_name) user.user_name = user_name;
            if (user_password) user.user_password = await userController.hashPassword(user_password);
            if (user_email) user.user_email = user_email;

            await user.save();

            // height나 weight가 변경된 경우에만 achievement 업데이트
            if (user_height !== undefined || user_weight !== undefined) {
                const today = new Date();
                today.setHours(today.getHours() + 9); // KST로 변환
                today.setHours(0, 0, 0, 0); // 시간 초기화

                let userAchievement = await UserAchievement.findOne({ user_id: req.user.user_id });
                
                if (!userAchievement) {
                    userAchievement = new UserAchievement({
                        user_id: req.user.user_id,
                        achievements: []
                    });
                }

                // 오늘 날짜의 achievement가 있는지 확인
                const todayAchievement = userAchievement.achievements.find(
                    a => isSameDay(new Date(a.date), today)
                );

                if (todayAchievement) {
                    // 오늘 데이터가 있으면 업데이트
                    if (user_height !== undefined) todayAchievement.user_height = user_height;
                    if (user_weight !== undefined) todayAchievement.user_weight = user_weight;
                } else {
                    // 오늘 데이터가 없으면 새로 추가
                    const lastAchievement = userAchievement.achievements[userAchievement.achievements.length - 1] || {};
                    userAchievement.achievements.push({
                        date: today,
                        user_height: user_height !== undefined ? user_height : lastAchievement.user_height,
                        user_weight: user_weight !== undefined ? user_weight : lastAchievement.user_weight,
                        goal_weight: lastAchievement.goal_weight
                    });
                }

                await userAchievement.save();
            }

            // 업데이트된 프로필 정보 조회
            const updatedProfile = await userController.getProfile(req, {
                json: (data) => data,
                status: () => ({ json: (data) => data })
            });

            res.json({
                success: true,
                message: '프로필이 성공적으로 업데이트되었습니다.',
                data: updatedProfile
            });
        } catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
        }
    },
    getWeightHistory: async (req, res) => {
        try {
            const user_id = req.user.user_id;
            
            // 현재 날짜 KST 기준으로 설정
            const endDate = new Date();
            endDate.setHours(endDate.getHours() + 9); // KST로 변환
            endDate.setHours(23, 59, 59, 999); // 해당 날짜의 마지막 시간으로 설정
            
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 13);
            startDate.setHours(0, 0, 0, 0); // 시작 날짜의 시작 시간으로 설정
            
            const weightHistory = [];
            
            for (let i = 0; i <= 13; i++) {
                const currentDate = new Date(endDate);
                currentDate.setDate(endDate.getDate() - i);
                // 각 날짜의 시작 시간으로 설정 (getAchievement 함수에서 사용)
                currentDate.setHours(0, 0, 0, 0);
                
                const achievement = await getAchievement(user_id, currentDate);
                
                weightHistory.push({
                    date: currentDate,
                    weight: achievement.user_weight
                });
            }

            // 날짜 오름차순으로 정렬
            weightHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

            res.json({
                success: true,
                data: weightHistory
            });
        } catch (error) {
            console.error('Error fetching weight history:', error);
            res.status(500).json({
                success: false,
                message: '체중 기록을 가져오는 중 오류가 발생했습니다'
            });
        }
    }
}

module.exports = userController;
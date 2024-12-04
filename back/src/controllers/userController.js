const {User, UserAchievement, UserDiet} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const emailService = require('../utils/emailService');

const SALT_ROUNDS=12;

const getAchievement = async (user_id, date = null) => {
    try{
        let matchStage={ $match: { user_id: user_id } };

        if(date){
            const startOfDay=new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay=new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            matchStage = {
                $match: {
                    user_id: user_id,
                    'achievements.date': {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            };
        }

        const achievement=await UserAchievement.aggregate([
            matchStage,
            { $unwind: '$achievements' },
            // 날짜가 주어진 경우 해당 날짜의 데이터만, 아닌 경우 가장 최근 데이터
            date ? 
                { $match: { 
                    'achievements.date': {
                        $gte: new Date(date).setHours(0, 0, 0, 0),
                        $lte: new Date(date).setHours(23, 59, 59, 999)
                    }
                }} :
                { $sort: { 'achievements.date': -1 } },
            { $limit: 1 },
            { $project: { 
                height: '$achievements.height',
                weight: '$achievements.weight',
                goal_weight: '$achievements.goal_weight',
                date: '$achievements.date'
            }}
        ]);

        return achievement[0] || {
            height: null,
            weight: null,
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
        try{
            const {user_name, user_id, user_password, user_gender, user_email, user_birth}=req.body;
            const user=new User({
                user_name: user_name,
                user_id: user_id,
                user_password: await userController.hashPassword(user_password),
                user_gender: user_gender?"female":"male",
                user_email: user_email,
                user_birth: user_birth,
                tokens: []
            });
            await user.save();
            res.json({user_id: user.user_id, message: '회원가입이 완료되었습니다'});
        }catch(error){
            if(error.code===11000)res.status(400).json({message:'이미 존재하는 아이디입니다'});
            else res.status(500).json({ message:`${error}`});
        }
    },
    signIn: async (req, res) => {
        try{
            const {user_id, user_password}=req.body;
            const user=await User.findOne({user_id: user_id});
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: '존재하지 않는 아이디입니다'});
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
            if(!isPasswordValid){
                user.login_attempts++;
                if(user.login_attempts>=5){
                    user.lock_until=new Date(Date.now() + 5*60*1000);
                    await user.save();
                    return res.status(429).json({message: '비밀번호를 5회 이상 틀렸습니다. 5분 후에 다시 시도해주세요.'});
                }
                await user.save();
                return res.status(400).json({message: `비밀번호가 일치하지 않습니다. 남은 시도 횟수: ${5 - user.login_attempts}회`});
            }

            user.login_attempts=0;
            user.lock_until=null;
            await user.save();

            const userAgent=req.headers['user-agent'];
            const parser=new UAParser(userAgent);
            const result=parser.getResult();
            const clientIp=req.ip;
            
            const deviceInfo={
                ua: userAgent,
                browser: {
                    name: result.browser.name ?? 'unknown',
                    version: result.browser.version ?? 'unknown'
                },
                engine: {
                    name: result.engine.name ?? 'unknown',
                    version: result.engine.version ?? 'unknown'
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
                cpu: {
                    architecture: result.cpu.architecture ?? 'unknown'
                },
                ip: clientIp,
                last_login_at: new Date(),
                last_used: new Date()
            };

            const refreshTokenFromCookie=req.cookies.refreshToken;
            let tokens=user.tokens ?? [];
            let refreshToken=null;
            let accessToken=null;

            if(refreshTokenFromCookie){
                try{
                    const decoded=jwt.verify(refreshTokenFromCookie, process.env.JWT_REFRESH_SECRET);
                    const tokenExp=decoded.exp*1000;
                    const sevenDays=7*24*60*60*1000;

                    if(tokenExp - Date.now() < sevenDays){
                        refreshToken=jwt.sign({
                            type: 'REFRESH',
                            user_id: user.user_id,
                            deviceInfo: decoded.deviceInfo
                        },
                        process.env.JWT_REFRESH_SECRET,
                        { expiresIn: '14d' }
                        );
                    }else{
                        refreshToken=refreshTokenFromCookie;
                    }
                }catch(error){
                    res.clearCookie('refreshToken', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        path: '/api'
                    });
                }
            }

            if(!refreshToken){
                refreshToken=jwt.sign({
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
            }

            accessToken=jwt.sign({
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

            const existingTokenIndex=tokens.findIndex(t => t.refresh_token === refreshTokenFromCookie);
            if(existingTokenIndex !== -1){
                tokens[existingTokenIndex]={
                    ...tokens[existingTokenIndex],
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    device_info: {
                        ...deviceInfo,
                        last_used: new Date()
                    }
                };
            }else{
                const MAX_DEVICES=5;
                if(tokens.length >= MAX_DEVICES){
                    tokens.sort((a, b) => new Date(a.device_info.last_used) - new Date(b.device_info.last_used));
                    tokens.shift();
                }
                tokens.push({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    device_info: {
                        ...deviceInfo,
                        last_used: new Date()
                    }
                });
            }

            await User.findOneAndUpdate(
                { user_id: user.user_id },
                { $set: { 
                    tokens: tokens,
                    login_attempts: 0,
                    lock_until: null
                }
            });

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
            
        }catch(error){
            res.status(500).json({ message: `${error}` });
        }
    },
    signOut: async (req, res) => {
        try{
            const user_id=req.user.user_id;
            const accessToken=req.headers.authorization?.split(' ')[1];
            
            try{
                const result=await User.updateOne(
                    { user_id: user_id },
                    { $pull: { 
                        tokens: { 
                            access_token: accessToken
                        }
                    }
                });

                if(result.modifiedCount === 0){
                    return res.status(401).json({ 
                        success: false,
                        message: '유효하지 않은 세션입니다' 
                    });
                }
            }catch(dbError){
                return res.status(500).json({ 
                    success: false,
                    message: '로그아웃 처리 중 오류가 발생했습니다' 
                });
            }

            res.clearCookie('refreshToken',{
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/api'
            });

            res.json({ 
                success: true,
                message: '로그아웃 되었습니다' 
            });
        }catch(error){
            res.status(500).json({ 
                success: false,
                message: '로그아웃 처리 중 오류가 발생했습니다'
            });
        }
    },
    deleteUser: async (req, res) => {
        try{
            const {user_id, user_email, user_name, deviceInfo}=req.user;
            const user_password=req.body.user_password;
    
            const user=await User.findOne({ 
                user_id: user_id,
                is_deleted: false
            });
            if(!user){
                return res.status(404).json({ 
                    success: false,
                    message: '사용자를 찾을 수 없습니다' 
                });
            }
    
            const isPasswordValid=await bcrypt.compare(user_password, user.user_password);
            if(!isPasswordValid){
                return res.status(400).json({ 
                    success: false,
                    message: '비밀번호가 일치하지 않습니다' 
                });
            }
    
            // Soft delete 처리
            await User.findOneAndUpdate(
                { user_id: user_id },
                { 
                    $set: {
                        is_deleted: true,
                        deleted_at: new Date(),
                        tokens: []
                    }
                }
            );
    
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
    
            await emailService.sendDeleteConfirmation(user_email, user_id, user_name, deviceInfo);
        }catch(error){
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
                    tokens: []
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
        try{
            const user_id=req.user.user_id;
            const user=await User.findOne({ user_id: user_id });
            const achievement=await getAchievement(user_id);

            res.json({
                success: true,
                message: '프로필 조회가 완료되었습니다',
                user_id: user.user_id,
                user_name: user.user_name,
                user_gender: user.user_gender === "female" ? 1 : 0,
                user_email: user.user_email,
                user_birth: user.user_birth,
                height: achievement.height ?? null,
                weight: achievement.weight ?? null,
                user_created_at: user.user_created_at
            });
        }catch(error){
            res.status(500).json({
                success: false,
                message: '프로필 조회 중 오류가 발생했습니다'
            });
        }
    },
    updateProfile: async (req, res) => {
        try{
            const user_id=req.user.user_id;
            const updates=req.body;
            
            const { user_height, user_weight }=updates;
            delete updates.user_height;
            delete updates.user_weight;

            if(Object.keys(updates).length > 0){
                if(updates.user_password) updates.user_password = await userController.hashPassword(updates.user_password);
                if('user_gender' in updates) updates.user_gender = updates.user_gender === 0 ? "male" : "female";
                await User.findOneAndUpdate(
                    { user_id: user_id },
                    { $set: updates },
                    { runValidators: true }
                );
            }

            const today=new Date();
            today.setHours(0, 0, 0, 0);

            const userAchievement=await UserAchievement.findOne({ user_id });

            if(userAchievement){
                const todayAchievement=userAchievement.achievements.find(
                    a => isSameDay(a.date, today)
                );

                if(todayAchievement){
                    if(user_height !== undefined) todayAchievement.height=user_height;
                    if(user_weight !== undefined) todayAchievement.weight=user_weight;
                }else{
                    userAchievement.achievements.push({
                        date: today,
                        height: user_height,
                        weight: user_weight
                    });
                }

                await userAchievement.save();
            }else{
                const newAchievement=new UserAchievement({
                    user_id,
                    achievements: [{
                        date: today,
                        height: user_height,
                        weight: user_weight,
                    }]
                });
                await newAchievement.save();
            }

            const achievement=await getAchievement(user_id);
            const user=await User.findOne({ user_id: user_id });

            res.json({
                success: true,
                message: '프로필이 업데이트되었습니다',
                user_id: user.user_id,
                user_name: user.user_name,
                user_gender: user.user_gender === "female" ? 1 : 0,
                user_email: user.user_email,
                user_birth: user.user_birth,
                height: achievement.height ?? null,
                weight: achievement.weight ?? null,
                user_created_at: user.user_created_at
            });
        }catch(error){
            if(error.name === 'ValidationError'){
                return res.status(400).json({
                    success: false,
                    message: '입력값이 유효하지 않습니다',
                    errors: Object.values(error.errors).map(err => err.message)
                });
            }
            res.status(500).json({
                success: false,
                message: '프로필 업데이트 중 오류가 발생했습니다'
            });
        }
    }
}

module.exports = userController;
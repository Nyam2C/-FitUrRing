const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User } = require('../models/user');
const UAParser = require('ua-parser-js');

const authMiddleware={
    securityHeaders: (req, res, next) => {
        try {
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('X-Frame-Options', 'DENY');
            next();
        } catch (error) {
            console.error('Error in securityHeaders:', error);
            if (!res.headersSent) {
                res.status(500).send('Internal Server Error');
            }
        }
    },
    apiLimiter: rateLimit({
        windowMs: 10 * 1000,
        max: 100,
        message: {
            message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
        },
        keyGenerator: (req) => {
            return req.headers['x-real-ip'] || 
            req.headers['x-forwarded-for']?.split(',')[0] || 
            req.ip;
        }
    }),
    authenticate: (fields = ['user_id']) => async (req, res, next) => {
        try {
            const headerToken = req.headers.authorization?.split(' ')[1];
            const queryToken = req.query.token;
            const token = headerToken || queryToken;
            const refreshToken = req.cookies?.refreshToken;

            const ALLOWED_FIELDS = [
                'user_id',
                'user_name',
                'user_email',
                'user_gender',
                'user_birth',
                'lock_until',
                'login_attempts',
                'user_height',
                'user_weight',
                'user_created_at',
                'type',
                'deviceInfo'
            ];
            
            if(!token){
                const error=new Error('로그인이 필요한 서비스입니다');
                error.status=401;
                return next(error);
            }
            const invalidFields=fields.filter(field => !ALLOWED_FIELDS.includes(field));
            if(invalidFields.length > 0){
                res.status(400).json({
                    success: false,
                    message: '허용되지 않은 필드가 요청되었습니다'
                });
                return;
            }
            let decoded;
            let tokenField;

            try{
                decoded=jwt.verify(token, process.env.JWT_ACCESS_SECRET);
                tokenField='tokens.access_token';
            }catch(error){
                if(error.name === 'TokenExpiredError' && refreshToken){
                    try{
                        const refreshDecoded=jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                        
                        const user=await User.findOne({
                            user_id: refreshDecoded.user_id,
                            'tokens': {
                                $elemMatch: {
                                    refresh_token: refreshToken
                                }
                            }
                        });

                        if(!user){
                            const error=new Error('유효하지 않은 세션입니다');
                            error.status=401;
                            return next(error);
                        }

                        const newAccessToken=jwt.sign({
                            type: 'ACCESS',
                            user_id: user.user_id,
                            deviceInfo: refreshDecoded.deviceInfo
                        },
                        process.env.JWT_ACCESS_SECRET,
                        { expiresIn: '1h' }
                        );

                        await User.updateOne({ 
                            user_id: refreshDecoded.user_id,
                            'tokens.refresh_token': refreshToken
                        },{ 
                            $set: { 
                                'tokens.$.access_token': newAccessToken,
                                'tokens.$.device_info.last_used': new Date()
                            }
                        });

                        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                        decoded=jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET);
                        tokenField='tokens.access_token';
                    }catch(refreshError){
                        const error = new Error('리프레시 토큰이 만료되었습니다');
                        error.status = 401;
                        return next(error);
                    }
                }else{
                    try{
                        decoded=jwt.verify(token, process.env.JWT_DELETE_SECRET);
                        tokenField='tokens.delete_token';
                    }catch(deleteError){
                        const error=new Error('유효하지 않은 토큰입니다');
                        error.status=401;
                        return next(error);
                    }
                }
            }
            
            const user=await User.findOne({
                user_id: decoded.user_id,
                [tokenField]: token
            });
            if(!user){
                const error=new Error('유효하지 않은 세션입니다');
                error.status=401;
                return next(error);
            }
            
            if(user.is_deleted && decoded.type !== 'DELETE'){
                const error=new Error('탈퇴 대기중인 사용자입니다');
                error.status=401;
                return next(error);
            }
            
            const userAgent=req.headers['user-agent'];
            const parser=new UAParser(userAgent);
            const result=parser.getResult();
            const clientIp=req.ip;
            
            const deviceInfo = {
                browser: {
                    name: result.browser.name ?? 'unknown'
                },
                os: {
                    name: result.os.name ?? 'unknown'
                },
                device: {
                    type: result.device.type ?? 'desktop'
                },
                ip: clientIp
            };

            const filteredUser = {
                ...fields.reduce((acc, field) => {
                    if(user[field] !== undefined) acc[field]=user[field];
                    return acc;
                }, {}),
                deviceInfo
            };

            req.user=filteredUser;
            next();
        }catch(error){
            error.status=401;
            error.message='유효하지 않은 토큰입니다';
            next(error);
        }
    },
    requestLogger: (req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    },
};

module.exports = authMiddleware;
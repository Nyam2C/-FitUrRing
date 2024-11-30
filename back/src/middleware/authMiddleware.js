const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User } = require('../models/user');
const logger = require('../utils/logger');

const authMiddleware={
    securityHeaders: (req, res, next) => {
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        next();
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
    authenticate: async (req, res, next) => {
        try{
            const token=req.headers.authorization?.split(' ')[1];
            
            if(!token) return res.status(401).json({ message: '로그인이 필요한 서비스입니다' });
            const decoded=jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            if(decoded.type !== 'ACCESS') return res.status(401).json({ message: '유효하지 않은 토큰입니다' });

            const user=await User.findOne({
                user_id: decoded.user_id,
                'tokens.access_token': token
            });
            if(!user) return res.status(401).json({ message: '유효하지 않은 세션입니다' });
            req.user=decoded;
            next();
        }catch(error){
            if(error.name === 'TokenExpiredError') return res.status(401).json({ message: '토큰이 만료되었습니다' });
            return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
        }
    },
    refreshToken: async (req, res) => {
        try{
            const refreshToken = req.cookies?.refreshToken;
            const oldAccessToken = req.headers.authorization?.split(' ')[1];

            if(!refreshToken || !oldAccessToken) return res.status(401).json({ message: '토큰이 필요합니다' });
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            if(decoded.type !== 'REFRESH') return res.status(401).json({ message: '유효하지 않은 Refresh 토큰입니다' });

            const user=await User.findOne({ 
                user_id: decoded.userId,
                'tokens': {
                    $elemMatch: {
                        access_token: oldAccessToken,
                        refresh_token: refreshToken
                    }
                }
            });

            if(!user) return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
            const deviceInfo=decoded.deviceInfo;
            const newAccessToken=jwt.sign({
                type: 'ACCESS',
                userId: user.user_id,
                userName: user.user_name,
                deviceInfo
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
            );

            await User.updateOne({ 
                user_id: decoded.userId,
                'tokens.refresh_token': refreshToken
            },
            { 
                $set: { 
                    'tokens.$.access_token': newAccessToken,
                    'tokens.$.device_info.last_used': new Date()
                }
            });
            res.json({ accessToken: newAccessToken });
        }catch(error){
            if(error.name === 'TokenExpiredError'){
                res.clearCookie('refreshToken');
                return res.status(401).json({ message: 'Refresh 토큰이 만료되었습니다' });
            }
            return res.status(401).json({ message: '유효하지 않은 Refresh 토큰입니다' });
        }
    },
    requestLogger: (req, res, next) => {
        const startTime=Date.now();
        let userId=req.body?.user_id??'anonymous';

        const accessToken=req.headers.authorization?.split(' ')[1];
        if(accessToken){
            try{
                const decoded=jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
                userId=decoded.userId;
            }catch(error){
                res.status(401).json({ message: '유효하지 않은 토큰입니다' });
            }
        }

        const originalEnd=res.end;
        res.end=function(chunk, encoding){
            originalEnd.apply(res, arguments);
            const logData={
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.path,
                userId,
                ip: req.ip,
                ips: req.ips,
                statusCode: res.statusCode,
                responseTime: `${Date.now() - startTime}ms`,
                userAgent: req.headers['user-agent']
            };
            if(res.statusCode >= 500) logger.error(logData);
            else if(res.statusCode >= 400) logger.warn(logData);
            else logger.info(logData);
        };

        next();
    },
};

module.exports = authMiddleware;
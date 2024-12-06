const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { User } = require('../models/user');
const UAParser = require('ua-parser-js');

const ERROR_MESSAGES = {
    LOGIN_REQUIRED: '로그인이 필요한 서비스입니다',
    INVALID_TOKEN: '유효하지 않은 토큰입니다',
    EXPIRED_TOKEN: '토큰이 만료되었습니다',
    INVALID_SESSION: '유효하지 않은 세션입니다',
    PENDING_DELETION: '탈퇴 대기중인 사용자입니다',
    INVALID_FIELD: '허용되지 않은 필드가 요청되었습니다',
    EXPIRED_DELETE_TOKEN: '만료된 탈퇴 토큰입니다'
};

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

const authMiddleware = {
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
            const token = extractToken(req);
            const refreshToken = req.cookies?.refreshToken;

            if (!token) {
                return next(createError(401, ERROR_MESSAGES.LOGIN_REQUIRED));
            }

            const invalidFields = fields.filter(field => !ALLOWED_FIELDS.includes(field));
            if (invalidFields.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_FIELD
                });
            }

            let decoded = jwt.decode(token);
            if (!decoded || !decoded.user_id) {
                return next(createError(401, ERROR_MESSAGES.INVALID_TOKEN));
            }

            if (isTokenExpired(decoded)) {
                if (decoded.type === 'DELETE') {
                    return next(createError(401, ERROR_MESSAGES.EXPIRED_DELETE_TOKEN));
                }
                if (refreshToken) {
                    decoded = await handleRefreshToken(refreshToken, res, next);
                } else {
                    return next(createError(401, ERROR_MESSAGES.EXPIRED_TOKEN));
                }
            }

            const user = await findUser(decoded, token);
            if (!user) {
                return next(createError(401, ERROR_MESSAGES.INVALID_SESSION));
            }

            if (user.is_deleted && decoded.type !== 'DELETE') {
                return next(createError(401, ERROR_MESSAGES.PENDING_DELETION));
            }

            req.user = filterUserFields(user, fields, req);
            next();
        } catch (error) {
            next(createError(401, ERROR_MESSAGES.INVALID_TOKEN));
        }
    },
    requestLogger: (req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    },
};

function extractToken(req) {
    const headerToken = req.headers.authorization?.split(' ')[1];
    const queryToken = req.query.token;
    return headerToken || queryToken;
}

function isTokenExpired(decoded) {
    return decoded.exp && decoded.exp * 1000 < Date.now();
}

async function handleRefreshToken(refreshToken, res, next) {
    const refreshDecoded = jwt.decode(refreshToken);
    if (!refreshDecoded || !refreshDecoded.user_id) {
        return next(createError(401, ERROR_MESSAGES.INVALID_TOKEN));
    }

    const user = await User.findOne({
        user_id: refreshDecoded.user_id,
        'tokens.access_sessions': {
            $elemMatch: {
                'token_pair.refresh_token': refreshToken
            }
        }
    });

    if (!user) {
        return next(createError(401, ERROR_MESSAGES.INVALID_SESSION));
    }

    const newAccessToken = jwt.sign({
        type: 'ACCESS',
        user_id: user.user_id,
        deviceInfo: refreshDecoded.deviceInfo,
        isRefreshGenerated: true
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1h' }
    );

    await User.updateOne(
        { 
            user_id: refreshDecoded.user_id,
            'tokens.access_sessions.token_pair.refresh_token': refreshToken 
        },
        { 
            $set: { 
                'tokens.access_sessions.$.token_pair.access_token': newAccessToken,
                'tokens.access_sessions.$.device_info.last_used': new Date()
            }
        }
    );

    res.setHeader('Authorization', `Bearer ${newAccessToken}`);
    return jwt.decode(newAccessToken);
}

async function findUser(decoded, token) {
    if (decoded.type === 'DELETE') {
        return await User.findOne({
            user_id: decoded.user_id,
            'tokens.delete_sessions': {
                $elemMatch: {
                    'delete_token': token
                }
            }
        });
    } else if (decoded.type === 'ACCESS') {
        return await User.findOne({
            user_id: decoded.user_id,
            'tokens.access_sessions': {
                $elemMatch: {
                    'token_pair.access_token': token
                }
            }
        });
    }
}

function filterUserFields(user, fields, req) {
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const clientIp = req.ip;

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

    return {
        ...fields.reduce((acc, field) => {
            if (user[field] !== undefined) acc[field] = user[field];
            return acc;
        }, {}),
        deviceInfo
    };
}

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

module.exports = authMiddleware;
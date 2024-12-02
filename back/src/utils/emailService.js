const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const UAParser = require('ua-parser-js');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

const emailService = {
    sendDeleteConfirmation: async (user_email, user_id, user_name, deviceInfo) => {
        const deleteToken = jwt.sign({
            type: 'DELETE',
            user_id: user_id,
            },
            process.env.JWT_DELETE_SECRET,
            { expiresIn: '24h' }
        );

        const user = await User.findOne({ user_id: user_id });
        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다');
        }

        await User.updateOne(
            { user_id: user_id },
            { 
                $set: { 
                    'tokens.0.delete_token': deleteToken,
                    'is_deleted': true,
                    'deleted_at': new Date()
                }
            }
        );

        const confirmationLink = `https://${process.env.SERVER_NAME}/api/confirm-delete?token=${deleteToken}`;
        const denyLink = `https://${process.env.SERVER_NAME}/api/cancel-delete?token=${deleteToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: '회원탈퇴 확인 메일',
            html: `
                <h2>회원탈퇴 확인</h2>
                <p>안녕하세요, ${user_name}님,</p>
                <p>${user_name}님의 계정이 ${deviceInfo.browser.name} ${deviceInfo.os.name} ${deviceInfo.device.type}에서(${deviceInfo.ip}) 비활성화되었습니다.</p>
                <p>계정을 완전히 삭제하시려면 삭제 버튼을 클릭해주세요.</p>
                <p>만약 탈퇴를 요청한 적이 없으면 취소 버튼을 클릭해주세요.</p>
                <p>이 링크는 24시간 동안만 유효합니다.</p>
                <p>24시간이 지나면 링크는 자동으로 비활성화 되고 삭제 대기상태로 유지됩니다.</p>
                <div style="margin: 20px 0;">
                    <a href="${confirmationLink}" 
                       style="background-color: #ff4444; 
                              color: white; 
                              padding: 10px 20px; 
                              text-decoration: none; 
                              border-radius: 5px;
                              display: inline-block;
                              margin-right: 10px;">
                        계정 완전히 삭제하기
                    </a>
                    <a href="${denyLink}" 
                       style="background-color: #4444ff; 
                              color: white; 
                              padding: 10px 20px; 
                              text-decoration: none; 
                              border-radius: 5px;
                              display: inline-block;">
                        삭제 취소하기
                    </a>
                </div>
                <p>주의: 삭제를 선택하면 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    },
    sendCancelDelete: async (user_email, user_name) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: '계정 삭제 취소 확인',
            html: `
                <h2>계정 삭제가 취소되었습니다</h2>
                <p>안녕하세요, ${user_name}님,</p>
                <p>회원님의 계정 삭제 요청이 취소되었습니다. 계정이 정상적으로 복구되었으며, 다시 로그인하여 서비스를 이용하실 수 있습니다.</p>
                <p>감사합니다.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    },
    sendHardDelete: async (user_email, user_name) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user_email,
            subject: '계정 완전 삭제 확인',
            html: `
                <h2>계정이 완전히 삭제되었습니다</h2>
                <p>안녕하세요, ${user_name}님,</p>
                <p>회원님의 계정이 완전히 삭제되었습니다. 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제되었습니다.</p>
                <p>서비스를 이용해 주셔서 감사합니다.</p>
            `
        };

        await transporter.sendMail(mailOptions);
    }
};

module.exports = emailService;
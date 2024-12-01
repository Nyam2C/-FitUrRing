//사용자 정보 조회를 위한 사용자 구조
const User = require('../models/user');

const userController = {
    createUser: async (req, res) => {
        try {
            const {
                user_id,
                user_password,
                user_name,
                user_gender,
                user_birthdate,
                user_email,
                user_created_at,
                user_last_login,
            } = req.body;
            const user = new User({
                user_id,
                user_password,
                user_name,
                user_gender,
                user_birthdate,
                user_email,
                user_created_at,
                user_last_login,
            });
            await user.save();
            res.json({ message: 'User signed in successfully', user });
        } catch (error) {
            res.json({ message: 'Failed to add User', error: error.message });
        }
    },
    signIn: (req, res) => {
        const { id, pw } = req.body;
        res.json({ message: 'signIn' });
    },
    logIn: (req, res) => {
        const { id, pw } = req.body;
    },
    getUser: async (req, res) => {
        try {
            const userInfo = await User.find();
            res.json(userInfo);
        } catch (error) {
            res.status(500).json({
                message: 'failed to retreive user : ',
                error: error.message,
            });
        }
    },
    getUserById: async (req, res) => {
        let { user_id } = req.params;
        try {
            const user = await User.findOne({ user_id });
            if (!user) {
                return res.json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.json({ error: error.message });
        }
    },
    updateById: async (req, res) => {
        let { user_id } = req.params;
        let {
            user_password,
            user_name,
            user_gender,
            user_birthdate,
            user_email,
            user_created_at,
            user_last_login,
        } = req.body;

        try {
            const user = await User.findOneAndUpdate(
                { user_id },
                {
                    user_password,
                    user_name,
                    user_gender,
                    user_birthdate,
                    user_email,
                    user_created_at,
                    user_last_login,
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({
                message: 'failed to update user',
                error: error.message,
            });
        }
    },
    deleteById: async (req, res) => {
        try {
            const { id: user_id } = req.params;
            const user = await User.findByIdAndDelete({ user_id });
            if (!user) {
                return res.json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({
                message: 'failed to delete user',
                error: error.message,
            });
        }
    },
};

module.exports = userController;

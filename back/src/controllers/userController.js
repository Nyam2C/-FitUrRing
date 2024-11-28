const userController = {
    createUser: (req, res) => {
        const { name, id, pw, email, age, height, weight } = req.body;
        res.json({ message: 'createUser' });
    },
    signIn: (req, res) => {
        const { id, pw } = req.body;
        res.json({ message: 'signIn' });
    }
}

module.exports = userController;
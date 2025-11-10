const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({ "message": "email, username and password are required."});

    // check for dupliicate username in db
    const duplicate = await User.findOne({ username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

        //Create and store new user
        const result = await User.create({
            "username": username,
            "email": email,
            "password": hashedPassword
        });

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ "message": 'Something went wrong' })
    }
}

module.exports = { handleNewUser };
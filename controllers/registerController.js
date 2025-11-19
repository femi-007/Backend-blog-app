const User = require('../model/User');
const bcrypt = require('bcrypt');
const { registerSchema } = require('../utils/validations/authValidation');
const { formatValidationError } = require('../utils/format');

const handleNewUser = async (req, res) => {
    // validate input
    const validationResult = registerSchema.safeParse(req.body)

    if (!validationResult.success) {
        return res.status.json({
            error: 'validation failed',
            detailts: formatValidationError(validationResult.error)
        });
    }

    const { username, email, password } = validationResult.data;

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
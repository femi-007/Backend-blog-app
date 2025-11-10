const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User');

const handleForgotPassword = async (req, res) => {
    const email = req.body.email;

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) return res.sendStatus(401);

    // create jwt
    const token = jwt.sign(
        { "id": foundUser._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD//Mailing app pawssword.
        }
   });

    const mailOptions = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: 'Reset your password',
        text: `${process.env.FRONTEND_URL}/reset-password/${foundUser.id}/${token}` //FrontEnd url.
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.sendStatus(500);
        res.sendStatus(200)
    })
}

const handleResetPassword = async (req, res) => {
    const {id, token} = req.params;
    const password = req.body;

    const foundUser = await User.findOne({ _id: id });
    if (!foundUser) return res.sendStatus(401);

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        async (err, decoded) => {
            if (err || foundUser._id === decoded.id) return res.sendStatus(403);

            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
            foundUser.password = hashedPassword;
            const result = await foundUser.save();

            res.status(200).json({ 'Message': 'Password updated.'});
        }
    )
}

module.exports = { handleForgotPassword, handleResetPassword };

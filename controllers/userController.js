const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addToken } = require("../config/blacklist");
const nodemailer = require("nodemailer");



//@desc Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mansatory !")
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        res.status(400);
        throw new Error("User already registered !")
    }

    if (password.length < 4) {
        res.status(400);
        throw new Error("Password should be at least 8 characters long!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({username, email, password: hashedPassword});

    if(user){
        res.status(201).json({
            message: "User registered successfully!",
            data: { _id: user.id, email: user.email }
        });      
    } else {
        res.status(400);
        throw new Error("Invalid user data!")
    }
});

//@desc Login User
//@route GET /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("Email and password are required!")
    }

    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
            }, 
            process.env.JWT_SECRET,
            {expiresIn: "30m"}
        );
        res.status(200).json({
            message: "Login successful!",
            data: { accessToken, user: { id: user.id, username: user.username, email: user.email } }
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password!");
    }
    
});

//@desc Current User info
//@route PUT /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User information fetched successfully!",
        data: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

//@desc Update user info
//@route PUT /api/users/update
//@access private
const updateUser = asyncHandler(async (req, res) => {
    const { username, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }

    user.username = username || user.username;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
        message: "User updated successfully!",
        data: { id: user.id, username: user.username, email: user.email }
    });
});

//@desc Logout User
//@route POST /api/users/logout
//@access private
const logoutUser = asyncHandler(async (req, res) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        addToken(token); 
    }else {
        res.status(400);
        throw new Error("No valid token provided");
    }

    res.status(200).json({
        message: "Logout successful!",
    });
});

const resetTokenStore = {};

//@desc Request password reset
//@route POST /api/users/request-password-reset
//@access public
const requestPasswordReset = asyncHandler(async (req, res) => {
    
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
        res.status(404);
        throw new Error("User with this email does not exist!");
    }
    
    const resetToken = `${Math.random().toString(36).substr(2)}${Date.now().toString(36)}`;

    resetTokenStore[email] = {
        token: resetToken,
        expires: Date.now() + 3600000, 
    };

    const resetLink = `${process.env.DOMAIN}/api/users/reset-password/${resetToken}`; 

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT, 
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, 
        },
    });

    const mailOptions = {
        from:  `"Contact Management Application" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Reset Your Password',
        html: `<h1>Reset Your Password</h1>
                <p>Please click this <a href="${resetLink}">link</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Error sending email' });
        }
        res.status(200).json({ message: "Please check your email for instructions to reset your password." });
    });
});

//@desc Reset password
//@route POST /api/users/reset-password/:token
//@access public
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword, email } = req.body;

    if (newPassword !== confirmPassword) {
        res.status(400);
        throw new Error("Passwords do not match!");
    }

    const storedTokenData = resetTokenStore[email];
    if (!storedTokenData || storedTokenData.token !== token || storedTokenData.expires < Date.now()) {
        res.status(400);
        throw new Error("Invalid or expired password reset token!");
    }

    
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete resetTokenStore[email];

    res.status(200).json({ message: "Password reset successfully!" });
});

module.exports = {  
    registerUser,
    loginUser,
    currentUser,
    updateUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
};
    
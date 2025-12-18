
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const token = (id, role) => {
    console.log('SECRET USED FOR SIGNING:', process.env.JWT_SECRET);
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            password: hashed,
            role,
        });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getprofile = async (req, res) => {
    res.json(req.user);
};
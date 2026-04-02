const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, profilePhoto, aadhar, pan } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        if (user) {
            // Create guide profile if role is guide
            if (role === 'guide') {
                const Guide = require('../models/Guide');
                await Guide.create({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    phone: '', // Optional
                    pricePerHour: req.body.pricePerHour || 500,
                    profilePhoto: profilePhoto || 'no-photo.jpg',
                    documents: {
                        aadhar: aadhar || '',
                        pan: pan || ''
                    },
                    location: {
                        type: 'Point',
                        coordinates: [85.7865, 20.2619] // Default to Odisha center
                    }
                });
            }

            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Check role
        if (user.role !== role) {
            return res.status(401).json({ success: false, message: 'Invalid role selected' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if guide is verified
        if (role === 'guide') {
            const Guide = require('../models/Guide');
            const guide = await Guide.findOne({ userId: user._id });
            if (!guide || !guide.isVerified) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account is under review'
                });
            }
        }

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Test Login (No password)
// @route   POST /api/auth/test-login
// @access  Public
exports.testLogin = async (req, res, next) => {
    try {
        const { role } = req.body;
        const testEmails = {
            admin: 'admin@guidego.com',
            guide: 'odisha@example.com',
            user: 'test-user@example.com'
        };

        const email = testEmails[role];
        if (!email) return res.status(400).json({ success: false, message: 'Invalid test role' });

        let user = await User.findOne({ email });

        // Auto-create if not found (Self-healing for dev environment)
        if (!user) {
            console.log(`🌱 Auto-creating test ${role}: ${email}`);
            user = await User.create({
                name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
                email,
                password: 'password123',
                role
            });
        }

        // Special handling for Guide
        if (role === 'guide') {
            const Guide = require('../models/Guide');
            let guide = await Guide.findOne({ userId: user._id });
            if (!guide) {
                guide = await Guide.create({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    isVerified: true,
                    pricePerHour: 500,
                    location: { type: 'Point', coordinates: [85.8245, 20.2961] }
                });
            } else if (!guide.isVerified) {
                guide.isVerified = true;
                await guide.save();
            }
        }

        res.status(200).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        console.error('Test Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error during test login' });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

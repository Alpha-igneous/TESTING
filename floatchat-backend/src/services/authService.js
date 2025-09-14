const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const logger = require('../config/logger');

class AuthService {
  generateToken(userId) {
    return jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  }

  verifyToken(token) {
    return jwt.verify(token, jwtConfig.secret);
  }

  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Generate token
    const token = this.generateToken(user._id);

    logger.info(`New user registered: ${email}`);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl
      },
      token
    };
  }

  async login(email, password) {
    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = this.generateToken(user._id);

    logger.info(`User logged in: ${email}`);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl
      },
      token
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user || !user.isActive) {
      throw new Error('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  profileImageUrl: {
    type: String,
    default: null,
    validate: {
      validator: function(url) {
        if (!url) return true;
        return /^https:\/\/images\.unsplash\.com\//.test(url);
      },
      message: 'Profile image must be a valid Unsplash URL'
    }
  },
  preferences: {
    defaultModel: { type: String, default: 'gemini-1.5-flash' },
    theme: { type: String, default: 'light', enum: ['light', 'dark', 'ocean'] },
    notifications: { type: Boolean, default: true }
  },
  subscription: {
    tier: { type: String, enum: ['free', 'premium'], default: 'free' },
    expiresAt: Date
  },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);

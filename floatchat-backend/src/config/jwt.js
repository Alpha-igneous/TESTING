const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h'  // Hardcoded 24 hours
};

// Validate secret on startup
if (!jwtConfig.secret) {
  throw new Error('JWT_SECRET must be provided in environment variables');
}

module.exports = jwtConfig;

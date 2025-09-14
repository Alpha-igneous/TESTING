module.exports = {
  // User roles and subscription tiers
  USER_ROLES: {
    FREE: 'free',
    PREMIUM: 'premium'
  },
  
  // UI themes
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    OCEAN: 'ocean'
  },

  // Chat message roles
  MESSAGE_ROLES: {
    USER: 'user',
    ASSISTANT: 'assistant',
    SYSTEM: 'system'
  },

  // Pagination defaults
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 20,
    MAX_LIMIT: 100
  },

  // Validation constants
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    MAX_CHAT_MESSAGE_LENGTH: 1000,
    MAX_QUERY_LENGTH: 500,
    MAX_SESSION_ID_LENGTH: 100
  },

  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // Error messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists with this email',
    TOKEN_EXPIRED: 'Token expired, please login again',
    INVALID_TOKEN: 'Invalid or expired token',
    ACCESS_DENIED: 'Access denied',
    VALIDATION_FAILED: 'Validation failed',
    SERVER_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    RAG_LLM_UNAVAILABLE: 'AI service is currently unavailable'
  },

  // Success messages
  SUCCESS_MESSAGES: {
    USER_REGISTERED: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    IMAGE_UPDATED: 'Profile image updated successfully',
    MESSAGE_SENT: 'Message sent successfully'
  },

  // ARGO data constants
  ARGO: {
    DEFAULT_FLOAT_ID: 6902746,
    DATA_MODES: ['R', 'A', 'D'],
    DIRECTIONS: ['A', 'D'],
    QC_FLAGS: [1, 2, 3, 4, 5, 8, 9],
    PARAMETERS: ['TEMP', 'PSAL', 'PRES'],
    MAX_DEPTH: 2000,
    MIN_LATITUDE: -90,
    MAX_LATITUDE: 90,
    MIN_LONGITUDE: -180,
    MAX_LONGITUDE: 180
  },

  // Rate limiting
  RATE_LIMIT: {
    DEFAULT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    DEFAULT_MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    AUTH_MAX_REQUESTS: 5, // Login attempts
    CHAT_WINDOW_MS: 1 * 60 * 1000, // 1 minute
    CHAT_MAX_REQUESTS: 10 // Chat messages
  },

  // File paths
  PATHS: {
    LOGS: './logs',
    UPLOADS: './uploads',
    TEMP: './temp'
  },

  // Environment types
  NODE_ENVIRONMENTS: {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
  }
};

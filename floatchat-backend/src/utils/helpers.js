const crypto = require('crypto');

class Helpers {
  /**
   * Generate a random string of specified length
   */
  static generateRandomString(length = 32) {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Generate a session ID
   */
  static generateSessionId() {
    return `session_${Date.now()}_${this.generateRandomString(8)}`;
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '');
  }

  /**
   * Format date to ISO string
   */
  static formatDate(date = new Date()) {
    return new Date(date).toISOString();
  }

  /**
   * Check if string is valid JSON
   */
  static isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Deep clone an object
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str) {
    if (typeof str !== 'string') return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Generate pagination metadata
   */
  static getPaginationMeta(page, limit, total) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNext,
      hasPrev,
      nextPage: hasNext ? page + 1 : null,
      prevPage: hasPrev ? page - 1 : null
    };
  }

  /**
   * Debounce function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Extract error message from error object
   */
  static extractErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unknown error occurred';
  }

  /**
   * Validate MongoDB ObjectId
   */
  static isValidObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
  }

  /**
   * Convert query string to object
   */
  static queryStringToObject(queryString) {
    const params = new URLSearchParams(queryString);
    const obj = {};
    for (const [key, value] = params) {
      obj[key] = value;
    }
    return obj;
  }
}

module.exports = Helpers;

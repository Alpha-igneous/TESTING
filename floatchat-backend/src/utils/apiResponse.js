const constants = require('./constants');

class ApiResponse {
  /**
   * Success response formatter
   */
  static success(data, message = constants.SUCCESS_MESSAGES.SUCCESS || 'Success', meta = {}) {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    };
  }

  /**
   * Error response formatter
   */
  static error(error, statusCode = constants.HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    return {
      success: false,
      error: error instanceof Error ? error.message : error,
      statusCode,
      details,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Paginated response formatter
   */
  static paginated(data, pagination, message = 'Data retrieved successfully') {
    return {
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Validation error response
   */
  static validationError(errors, message = constants.ERROR_MESSAGES.VALIDATION_FAILED) {
    return {
      success: false,
      error: message,
      statusCode: constants.HTTP_STATUS.BAD_REQUEST,
      validationErrors: errors,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Authentication error response
   */
  static authError(message = constants.ERROR_MESSAGES.ACCESS_DENIED) {
    return {
      success: false,
      error: message,
      statusCode: constants.HTTP_STATUS.UNAUTHORIZED,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Not found error response
   */
  static notFound(resource = 'Resource') {
    return {
      success: false,
      error: `${resource} not found`,
      statusCode: constants.HTTP_STATUS.NOT_FOUND,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Service unavailable response
   */
  static serviceUnavailable(service = 'Service') {
    return {
      success: false,
      error: `${service} is currently unavailable`,
      statusCode: constants.HTTP_STATUS.SERVICE_UNAVAILABLE,
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = ApiResponse;

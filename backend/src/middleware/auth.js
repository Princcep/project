const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock test users (for development/testing)
const MOCK_USERS = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  'engineer@example.com': {
    id: '2',
    email: 'engineer@example.com',
    name: 'Engineer User',
    role: 'engineer',
  },
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Check if it's a mock token (for development/testing)
    if (token.startsWith('mock_token_')) {
      // Extract email from mock token format: mock_token_timestamp_email
      const parts = token.split('_');
      if (parts.length >= 4) {
        // Reconstruct email from parts
        const emailParts = parts.slice(3).join('_');
        const email = emailParts.replace(/_/g, '.').replace(/dot/g, '.');
        
        // Find mock user by email
        const mockUser = Object.values(MOCK_USERS).find(u => 
          u.email.replace('@', '_').replace('.', '_') === emailParts || 
          emailParts.includes('admin') || 
          emailParts.includes('engineer')
        );
        
        if (mockUser) {
          req.user = mockUser;
          return next();
        }
      }
      // For any mock token, default to admin for testing
      req.user = {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      };
      return next();
    }

    // Verify real JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to perform this action',
      });
    }
    next();
  };
};

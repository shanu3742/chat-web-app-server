const xss = require('xss');


// XSS Sanitization Middleware
exports.sanitizeInput = (req, res, next) =>  {
    // Helper function to sanitize objects recursively
    const sanitizeObject = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = xss(obj[key]); // Sanitize string values
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]); // Recursively sanitize objects
        }
      }
    };
  
    // Sanitize req.body, req.query, and req.params
    if (req.body) sanitizeObject(req.body);
    if (req.query) sanitizeObject(req.query);
    if (req.params) sanitizeObject(req.params);
  
    next(); // Call the next middleware/route handler
  }
  
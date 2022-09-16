
const rateLimit = require('express-rate-limit');

// Limit request to 10 within 1 minutes
exports.limiter = rateLimit({
	windowMs: 1 * 60 * 1000, 
	max: 10, 
	standardHeaders: true,
	legacyHeaders: false,
})
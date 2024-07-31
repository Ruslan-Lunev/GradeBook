"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const settings_1 = require("../settings");
const jwt = require("jsonwebtoken");
/**
 * Middleware function to verify JWT token
 */
const authenticate = (req, res, next) => {
    var token = req.cookies['token'];
    //const token = req.header('Authorization').split(' ')[1]
    //const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = jwt.verify(token, settings_1.security.jwtSecret);
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=authentication.js.map
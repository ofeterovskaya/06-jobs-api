const User = require('../models/User');
const jwt = require('jsonwebtoken');
const{UnauthenticatedError} = require('../errors');

// Middleware for user authentication
const auth = async (req, res, next) => {
    // Check if authorization header is present and correctly formatted
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {//empty space after Bearer is important!!!!
        throw new UnauthenticatedError('Authentication invalid');
    }
    
    const token = authHeader.split(' ')[1]; // Extract the token from the authorization header
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        //attach user to request job routes
        req.user = {userId: payload.userId, name: payload.name};// Attach user information to the request object
        next(); // Pass control to the next middleware function
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = auth;

//if we want to get user from db, we can do this:
// const user = User.findById(payload.userId).select('-password');
// req.user = user;
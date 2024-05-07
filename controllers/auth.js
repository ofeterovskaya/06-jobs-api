const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError}=require('../errors');

//to register a new user
const register = async (req, res) => {
    const user = await User.create(req.body);

    // Create a JWT for the new user
    const token = user.createJWT();   
     res.status(StatusCodes.CREATED).json({user: { name: user.name }, token});//send token to user, or add name to response
}
//to login a user
const login = async (req, res) => {
    const {email, password} = req.body; // Extract email and password from the request body
        if (!email || !password) {
            throw new BadRequestError('Please provide email and password');
        }
        
    const user = await User.findOne({email});   // Find a user with the provided email 
        if (!user) {
            throw new UnauthenticatedError('Invalid Credentials');
        }
    //compare password with the user's password
    const isPasswordCorrect = await user.comparePasswords(password);
        if (!isPasswordCorrect) {
            throw new UnauthenticatedError('Invalid Credentials');
        }
    const token = user.createJWT();  // Create a JWT for the user
    res.status(StatusCodes.OK).json({user: {name: user.name}, token});
    }
module.exports = {
    register,
    login,
}



//  const {name, email, password} = req.body;
    // if (!name || !email || !password) {
    //     throw new BadRequestError( 'Please provide name, email and password' );   
    // } 
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    // const tempUser = {name, email, password: hashedPassword};
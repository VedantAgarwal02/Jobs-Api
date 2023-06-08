const jwt = require('jsonwebtoken')
const userModel = require('../models/User');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors/index')

const login = async(req,res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    let user = await userModel.findOne({email});
    if(!user) {
        throw new UnauthenticatedError("Invalid Credentials");
    }

    const isCorrectPassword = await user.comparePassword(password);
    if(!isCorrectPassword) {
        throw new UnauthenticatedError("Invalid Credentials")
    }

    const token = user.createJWT()

    res.status(StatusCodes.OK).json({user:{name:user.name}, token})
}

const signup = async(req,res) => {
    const {name, email, password} = req.body
    const user = await userModel.create(req.body);
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({user:{name:user.name}, token})
}

module.exports = {
    login, 
    signup
}
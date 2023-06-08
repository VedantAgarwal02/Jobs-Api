const userModel = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Access Denied")
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId : payload.userId, name : payload.username}
        next();
    }
    catch(error) {
        throw new UnauthenticatedError("Access Denied")
    }
}

module.exports = auth;
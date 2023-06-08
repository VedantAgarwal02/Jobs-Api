const express = require("express");
const { login, signup } = require("../controllers/auth");
const authRouter = express.Router();

authRouter.route('/login').get(login)
authRouter.route('/signup').post(signup)

module.exports = authRouter;
const { custom } = require('joi')
const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg : err.message || "Something went wrong try again later."
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  if(err.name === 'ValidationError') {
   customError.msg = err.errors[Object.keys(err.errors)[0]].message;
   customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.code && err.code==11000) {
    customError.msg = `Email is already in use. Try Logging in.`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if(err.name === 'CastError') {
    customError.msg =  `No Item Found with id : ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  return res.status(customError.statusCode).json({ msg : customError.msg })
}

module.exports = errorHandlerMiddleware

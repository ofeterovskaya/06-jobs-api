//const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
const customError = {
  //set default values
  statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: err.message || 'Something went wrong, please try again',

}
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if (err.name === 'ValidationError') {
    console.log(Object.values(err.errors))
    customError.statusCode = 400
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    
  }

 if(err.code && err.code === 11000){
    customError.statusCode = 400
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose anouther value`
  }
  if(err.name === 'CastError'){
    customError.statusCode = 404
    customError.msg = `No item found with id: ${err.value}`
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware

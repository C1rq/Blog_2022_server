
const HttpException = require("../exceptions/http.exception")

const noMatchMiddleware =(req,res,next)=>{
  // res.status(404)
  //   .json({
  //     code:0,
  //     message:'router url not found'
  //   })

  const noMatchError = new HttpException(404,"访问路径不匹配",'router url not found');
  next(noMatchError)

}


module.exports = noMatchMiddleware
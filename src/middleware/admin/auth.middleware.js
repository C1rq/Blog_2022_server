const HttpException = require("../../exceptions/http.exception");

const {decode} = require("../../utils/jwt")


module.exports.authMiddleware = async (req,res,next)=>{
  // console.log('authMiddleware');
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return next(new HttpException(401,'authorization 必须提供',"authorization is missing"))
  }

  const tokenType = authHeader.split(' ')[0];
  const tokenContent = authHeader.split(' ')[1];
  // console.log(tokenContent);

  if(tokenType !== 'Token'){
    return next(new HttpException(401,'authorization 格式错误  格式 Token',"Token is missing"))
  }
  if(!tokenContent){
    return next(new HttpException(401,'authorization 格式错误  格式 Token content',"TokenContent is missing"))
  }

  // 解签
  try {
    const user = decode(tokenContent);
    if(!user){
      return next(new HttpException(401,'authorization 格式错误  格式 Token content',"TokenContent is missing"))
    }
    req.user = user
    req.token = tokenContent
    
    return next()
  } catch (error) {
    // jwt
    return next(new HttpException(401,"authorization token 验证失败",error.message))
  }
}
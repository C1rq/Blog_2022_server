
const errorMiddleware =(error,req,res,next)=>{

  // error 是 HTTPEXCEPTION  实例

  const status = error.status || 500
  const message = error.message || '服务器错误'
  const errors = error.errors || 'server is wrong'

  res.status(status).json({
    code:0,
    message,
    errors
  })
}


module.exports = errorMiddleware

const validator = require('validator')

module.exports.validateCreateArticle = (title,body)=>{
  let error = {}

  if(validator.isEmpty(title)){
    error.title = "文章标题不能为空"
  }
  if(validator.isEmpty(body)){
    error.body = "文章内容不能为空"
  }
  let validate =  Object.keys(error).length <1    //true   验证通过   false  验证失败
 return {error,validate}

}



const {validateCreateUser,validateUserLogin} = require("../utils/validate/user.validate")
const HttpException  = require("../exceptions/http.exception")
const User = require("../models/user")
const {md5Password,matchPassword} = require("../utils/bcrypt")
const {sign} = require("../utils/jwt");


// 获取用户
module.exports.getUser = async (req,res,next)=>{
  try {
    // console.log(req.user);
    const {email} = await req.user
    const user = await User.findByPk(email);
    if(!user){
      throw new HttpException(401,"用户不存在","user is not found")
    }
    delete user.dataValues.password
    user.dataValues.token = req.token

    return res.status(200)
                .json({
                  status:1,
                  message:"获取成功",
                  data:user.dataValues
                })
  } catch (error) {
      next(error)
  }

}
// 用户登录

module.exports.login = async (req,res,next)=>{
  try {
    const {email,password} = req.body.user

  let {error,validate} = await validateUserLogin(email,password)


  //验证数据
  const user = await User.findByPk(email);
  if(!user){
    throw new HttpException(401,'用户不存在','user not found')
  }

  //  密码是否匹配

  const oldPWD = user.dataValues.password;

  const match = await matchPassword(oldPWD,password);
  
  if(!match){
    throw new HttpException(401,'密码错误','password not match')
  }
  //  生成token 返回
    delete user.dataValues.password;
    user.dataValues.token = await sign(
        user.dataValues.username,
        user.dataValues.email,
    )  
    console.log(user.dataValues.token);

      return  res.status(200)
            .json({
              status:1,
              message:"登录成功",
              data:user.dataValues
            })
    
  } catch (error) {
    next(error)
  }
}

// 用户注册
module.exports.createUser = async (req,res,next)=>{
  try {
    let {username,password,email} = req.body.user;

    // 数据验证 
    let {error,validate} = validateCreateUser(username,password,email);
    if(!validate){
      throw new HttpException(422,'用户提交数据验证失败',error)
    }

    const existUser = await User.findByPk(email);
    if(existUser){
      throw new HttpException(422,'用户邮箱已存在',error)
    }
      //  不存在    密码加密  存入数据库
    const md5PWD = await md5Password(password);
   const user = await User.create({
      username,
      password:md5PWD,
      email
    })

  // 创建成功   生成token  返回数据

  if(user){
    console.log(user);

    //  生成token 

    let data = {};
    data.username =user.username;
    data.email = user.email;
    data.token = await sign(user.username,user.email);
    data.bio = null;
    data.avatar = null;
    res.status(201)   //创建数据成功
        .json({
          status:1,
          data,
          message:"创建用户成功！"
        })
  }



  } catch (error) {
    next(error)
  }
 



 



  //  存在  抛出错误



  //  不存在    密码加密  存入数据库



  // 整体异常捕获


}

// 修改用户信息

module.exports.updateUser = async (req,res,next)=>{
  try {
    const {email} = await req.user
    const user =await User.findByPk(email)
    if(!user){
      return new HttpException(401,"用户不存在","user is not found")
    }
    const bodyUser = req.body.user

    console.log(bodyUser);
    // console.log(user);
    if(bodyUser){
      const username = bodyUser.username ? bodyUser.username : user.username
      const bio = bodyUser.bio ? bodyUser.bio : user.bio
      const avatar = bodyUser.avatar ? bodyUser.avatar : user.avatar
      let password = user.password
      if(bodyUser.password){
        password =await md5Password(bodyUser.password)
      }
      const updatedUser = await user.update({
        username,
        bio,
        avatar,
        password
      })
      delete updatedUser.dataValues.password
      updatedUser.dataValues.token = await sign(username,email)
      return res.status(200)
                  .json({
                    status:1,
                    message:"修改用户信息成功",
                    data:updatedUser.dataValues
                  })
    }else{
      return new HttpException(401,"更新数据不能为空","bodyUser is null")
    }
    
  } catch (error) {
    next(error)
  }
}
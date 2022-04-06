const HttpException = require("../exceptions/http.exception");
const User = require("../models/user");

// 添加关注
module.exports.follow = async (req,res,next)=>{
  try {
    // 获取参数  被关注的人
    const username = req.params.username;
    
    // 校验 被关注的人是否存在

    const userA = await User.findOne({
      where:{
        username
      }
    })
    if(!userA){
      return new HttpException(404,"关注用户不存在","follow user is not found")
    }

    const {email} =await req.user;
    const userB = await User.findByPk(email)


    // 添加关注
    await userA.addFollowers(userB)

    const profile = {
      username:userA.username,
      avatar:userA.avatar,
      bio:userA.bio,
      following:true
    }

    res.status(200)
        .json({
          status:1,
          message:"关注成功",
          data:profile
        })
  } catch (error) {
      next(error)
  }

}

// 取消关注
module.exports.cancelFollow = async (req,res,next)=>{
  try {
    // 获取参数  被关注的人
    const username = req.params.username;
    
    // 校验 被关注的人是否存在

    const userA = await User.findOne({
      where:{
        username
      }
    })
    if(!userA){
      return new HttpException(404,"关注用户不存在","follow user is not found")
    }

    const {email} =await req.user;
    const userB = await User.findByPk(email)


    // 取消关注
    await userA.removeFollowers(userB)

    const profile = {
      username:userA.username,
      avatar:userA.avatar,
      bio:userA.bio,
      following:false
    }

    res.status(200)
        .json({
          status:1,
          message:"取消关注成功",
          data:profile
        })
  } catch (error) {
      next(error)
  }

}

// 查看关注
module.exports.showFollowers = async (req,res,next)=>{
  try {
    // 获取参数  被关注的人
    const username = req.params.username;
    
    // 校验 被关注的人是否存在

    const authorUser = await User.findOne({
      where:{
        username
      },
      include:['followers']
    })
    // console.log(authorUser);
    if(!authorUser){
      return new HttpException(404,"关注用户不存在","follow user is not found")
    }

    const {email} =await req.user
    // console.log(email);
    let following = false;
    const followers = []

    for(const user of authorUser.followers){
      // user.dataValues.email
      // console.log(user.dataValues.email);
      if(email === authorUser.followers){
        following = true
      }
      delete user.dataValues.password
      delete user.dataValues.Follows
      followers.push(user.dataValues)
    }
    const profile = {
      username:authorUser.username,
      avatar:authorUser.avatar,
      bio:authorUser.bio,
      following,
      followers,
    }
   return  res.status(200)
        .json({
          status:1,
          message:"获取关注列表成功",
          data:profile
        })
 

    
    // const loginUser = await User.findByPk(email)



    
  } catch (error) {
      next(error)
  }
}
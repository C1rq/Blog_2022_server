const HttpException = require("../exceptions/http.exception");
const Article = require("../models/article");
const Comment = require("../models/comment");
const User = require("../models/user");



//   创建评论
module.exports.addComment = async(req,res,next)=>{
  try {
    // 获取文章
    const {slug} = await req.params;
    const article = await Article.findByPk(slug);
    // 获取评论
    const {body} = await req.body.comment;
    if(!body){
      throw new HttpException(404,"评论内容不能为空",'commet is not allow null')
    }

    if(!article){
      throw new HttpException(404,"评论文章不存在",'comment of article is not found')
    }
    const {email} = await req.user

    const user = await User.findByPk(email);

    if(!user){
      throw new HttpException(404,"评论用户不存在","comment user is not found")
    }
    let newComment = await Comment.create({body})


    await user.addComments(newComment);
    await article.addComments(newComment)
    newComment.dataValues.user = {
      username:user.dataValues.username,
      bio:user.dataValues.bio,
      avatar:user.dataValues.avatar
    };

    res.status(200)
        .json({
          status:1,
          message:"创建评论成功",
          data:newComment
        })

  } catch (error) {
    next(error)
  }
}

// 获取评论列表
module.exports.getComments = async(req,res,next)=>{
  try {
    const {slug} = await req.params;
    const article =await Article.findByPk(slug);
    if(!article){
      throw new HttpException(404,"获取评论文章不存在",error)
    }

    const comments = await Comment.findAll({
      where:{
        articleSlug : slug,
      },
      include:[{
        model:User,
        attributes:["username","avatar","bio"]
      }]
    })

    res.status(200)
        .json({
          status:1,
          message:"获取评论列表成功",
          data:comments
        })

  } catch (error) {
    next(error)
  }
}


// 删除评论

module.exports.deleteComment = async(req,res,next)=>{
  try {
    const {slug,id} = await req.params;
    const article = await Article.findByPk(slug);
    if(!article){
      throw new HttpException(404,"删除文章不存在",error)
    }
    const comment = await Comment.findByPk(id);
    if(!comment){
      throw new HttpException(404,"删除评论不存在",'delete comment is not found')
    }
    const {email} = await req.user
    if(email !== comment.dataValues.UserEmail && email !== article.dataValues.UserEmail){
      throw new HttpException(403,'用户没有删除评论权限','is not authorization')
    }

    await Comment.destroy({where:{
      id
    }});
    res.status(200)
        .json({
          status:1,
          message:"删除评论成功"
        })

  } catch (error) {
    next(error)
  }
}
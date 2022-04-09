const HttpException = require("../exceptions/http.exception")
const Article = require("../models/article")
const Tag = require("../models/tag")

function handleArticle(article,author,count){
  const newTags = [];
  for (const t of article.dataValues.tags) {
     newTags.push(t.name)
  }
  article.dataValues.tags = newTags

  delete author.dataValues.password
  delete author.dataValues.email
  article.dataValues.author = author

  article.dataValues.favoriteCount = count

  article.dataValues.favorited = true

  return article.dataValues

}

module.exports.addFavorite= async (req,res,next)=>{
  try {
    const {slug} = await req.params
    const article = await Article.findByPk(slug,{include:Tag})
    if(!article){
      throw new HttpException(404,"喜欢的文章不存在","article is not found")
    }
    const {email} = await req.user

    await article.addUsers(email)  //文章添加点赞用户

    const author = await article.getUser();  //文章作者

    const count  = await article.countUsers();  //点赞数量


    const favoriteData = handleArticle(article,author,count)

  
    



    res.status(200)
        .json({
          status:1,
          message:"点赞成功",
          data:favoriteData
        })
  } catch (error) {
    next(error)
  }
}



module.exports.cancelFavorite = async (req,res,next)=>{
  try {
    const {slug} = await req.params
    const article = await Article.findByPk(slug,{include:Tag})
    if(!article){
      throw new HttpException(404,"取消喜欢的文章不存在","article is not found")
    }
    const {email} = await req.user
    await article.removeUsers(email)  //文章移除点赞用户

    const author = await article.getUser();  //文章作者

    const count  = await article.countUsers();  //点赞数量


    const favoriteData = handleArticle(article,author,count)
    favoriteData.favorited = false



    res.status(200)
        .json({
          status:1,
          message:"点赞成功",
          data:favoriteData
        })
  } catch (error) {
    next(error)
  }
}

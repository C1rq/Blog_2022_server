const HttpException = require("../exceptions/http.exception");
const User = require("../models/user")
const {getSlug} = require("../utils/slug")
const Article = require("../models/article")
const {validateCreateArticle} = require("../utils/validate/article.validate");
const Tag = require("../models/tag");
const sequelize = require("../db/sequelize");

// 处理文章信息  公共方法  返回文章 信息   带作者信息  带标签 
function handleArticle(article,author){
  const newTags = [];
  for (const t of article.dataValues.tags) {
     newTags.push(t.name)
  }
  article.dataValues.tags = newTags

  delete author.dataValues.password
  delete author.dataValues.email

  article.dataValues.author = author

  return article.dataValues

}

// 处理文章信息

function handleArticles(article){
  const newTags = [];
  for (const t of article.dataValues.tags) {
     newTags.push(t.name)
  }
  article.dataValues.tags = newTags

  // 处理作者信息
  console.log(article);
  let {email,username,avatar,bio} = article.dataValues.User
  let author = {
    email,username,avatar,bio
  }
  delete article.dataValues.User;
  article.dataValues.author = author;
  return article.dataValues

}


//创建文章
module.exports.createArticle = async (req,res,next)=>{
  try {
    const {title,description,body,tags} =await req.body.article;
    const {error,validate} =await  validateCreateArticle(title,body)
    if(!validate){
      throw new HttpException(401,"文章创建参数错误",error)
    }

    const {email} = await req.user;
    const author = await User.findByPk(email)
    if(!author){
      throw new HttpException(401,"用户登未登录，无法创建",'user is not login')
    }

    let slug = getSlug();

   let article = await  Article.create({
      title,
      description,
      body,
      slug,
      UserEmail:author.email
    })

    // console.log(article.__proto__);

    if(tags){
      for(const t of tags){
        console.log(t);
        let existTag = await Tag.findByPk(t)
        let newTag;
        if(!existTag){
          newTag = await Tag.create({name:t})
          await  article.addTag(newTag)
        }else{
          await article.addTag(existTag)
        }
      }
    }

   article = await Article.findByPk(slug,{include:Tag})

   article =  handleArticle(article,author)

   
    res.status(201)
        .json({
          status:1,
          message:"文章创建成功",
          data:article
        })

  } catch (error) {
    next(error)
  }
}


//  获取单个文章
module.exports.getArticle = async (req,res,next)=>{
  try {
    const {slug} = await req.params;
    let article = await Article.findByPk(slug,{include:Tag});
    const author = await article.getUser();
    // console.log(author);

    article =  handleArticle(article,author)
    // console.log(article);

    
    res.status(200)
        .json({
          status:1,
          message:"获取文章成功",
          data:article
        })
  } catch (error) {
    next(error)
  }
}

//修改文章
module.exports.updateArticle = async (req,res,next)=>{
  try {
      const {slug} = await req.params;
      const {title,description,body} = req.body.article;
      let article = await Article.findByPk(slug,{include:Tag});

      // 当前登录用户信息 
      const {email} = await req.user
      const LoginUser = await User.findByPk(email)
      if(!LoginUser){
        throw new HttpException(401,"用户登未登录",'user is not login')
      }
      const authorEmail =  article.UserEmail
      if(LoginUser.email != authorEmail){
        return new HttpException(403,"当前用户没有修改权限",error)
      }
      const  newTitle = title ? title : article.title;
      const  newDescription = description ? description : article.description
      const newBody = body ? body : article.body
      const updateArticle = await article.update({title:newTitle,description:newDescription,body:newBody})
      const resData = handleArticle(updateArticle,LoginUser)

      res.status(200)
          .json({
            status:1,
            message:"文章更新成功",
            data:resData
          })
  } catch (error) {
    next(error)
  }
}

//  删除文章
module.exports.deleteArticle = async (req,res,next)=>{
  try {
      const {slug} = await req.params;
      let article = await Article.findByPk(slug,{include:Tag});
      if(!article){
        throw new HttpException(401,'删除文章不存在','article is not found')
      }
      // 当前登录用户信息 
      const {email} = await req.user
      const LoginUser = await User.findByPk(email)
      if(!LoginUser){
        throw new HttpException(401,"用户登未登录",'user is not login')
      }
      const authorEmail =  article.UserEmail
      if(LoginUser.email != authorEmail){
        return new HttpException(403,"当前用户没有删除权限",error)
      }
      Article.destroy({where:{slug}})

      res.status(200)
          .json({
            status:1,
            message:"文章删除成功"
          })
  } catch (error) {
    next(error)
  }
}



//  获取所有文章
module.exports.getArticles = async (req,res,next)=>{
  try {
    const {tag,author,limit=20,offset=0} = await req.query;
    let articleAll = [];
    if(tag&&!author){
      articleAll = await Article.findAll({
        include:[{
          model:Tag,
          attributes:["name"],
          where:{name:tag}
        },
        {
          model:User,
          attributes:["email","username","avatar","bio"],
        }],
        limit:parseInt(limit),
        offset:parseInt(offset)
      })
    }else if(!tag&&author){
      articleAll = await Article.findAll({
        include:[{
          model:Tag,
          attributes:["name"],
        },
        {
          model:User,
          attributes:["email","username","avatar","bio"],
          where:{
            username:author
          }
        }],
        limit:parseInt(limit),
        offset:parseInt(offset)
      })
    }else if (tag&&author){
      articleAll = await Article.findAll({
        include:[{
          model:Tag,
          attributes:["name"],
          where:{
            name:tag
          }
        },
        {
          model:User,
          attributes:["email","username","avatar","bio"],
          where:{
            username:author
          }
        }],
        limit:parseInt(limit),
        offset:parseInt(offset)
      })
    }else{
      articleAll = await Article.findAll({
        include:[{
          model:Tag,
          attributes:["name"],
        },
        {
          model:User,
          attributes:["email","username","avatar","bio"],
        }],
        limit:parseInt(limit),
        offset:parseInt(offset)
      })
    }
    let articleList = [];
    for (const a of articleAll) {
      articleList.push(handleArticles(a))
    }
     res.status(200)
        .json({
          status:1,
          message:"条件查询获取文章成功",
          data:articleList
        })
  } catch (error) {
    next(error)
  }
}


//  获取关注的作者文章
module.exports.getFollowArticle = async (req,res,next)=>{
  try {
    const user =await req.user;
    const fansEmail = user.email;
    const query = `SELECT UserEmail FROM Follows WHERE followerEmail="${fansEmail}"`
    const followAuthors =await sequelize.query(query);

    if(followAuthors[0].length === 0){
      res.status(200)
          .json({
            status:1,
            message:"没有关注用户",
            data:[]
          })
    }
    let followAuthorEmails = [];
    for(const o of followAuthors[0]){
      followAuthorEmails.push(o.UserEmail)
    }
    let articleAll = await Article.findAll({
      where:{
        UserEmail:followAuthorEmails
      },
      include:[Tag,User]
    })
    let articles =[]
    for(const a of articleAll){
     articles.push(handleArticles(a))
    }

    res.status(200)
        .json({
          status:1,
          message:"文章获取成功",
          data:articles
        })
  } catch (error) {
    next(error)
  }
}
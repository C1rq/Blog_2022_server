const sequelize = require("../db/sequelize")

const dbconnection = require('../db/connection');

const User = require("../models/user");
const Article = require("../models/article");
const Tag = require("../models/tag");
const Comment = require("../models/comment");


// A.hasOne(B); // A 有一个 B
// A.belongsTo(B); // A 属于 B
// A.hasMany(B); // A 有多个 B
// A.belongsToMany(B, { through: 'C' }); // A 属于多个 B , 通过联结表 C

const initRelation = ()=>{
  //  用户和文章的关系   一对多
  User.hasMany(Article,{
    onDelete:'CASCADE'
  })
  Article.belongsTo(User)

  // 用户和评论的关系   一个用户有多个评论   一个评论对应一个用户

  User.hasMany(Comment,{
    onDelete:'CASCADE'
  });

  // 评论和文章的关系   一对多  一篇文章对应多条评论
  Comment.belongsTo(User);

  Article.hasMany(Comment,{onDelete:"CASCADE"})
  Comment.belongsTo(Article)

  // 用户  对 文章  喜欢   多对多关系

  User.belongsToMany(Article,{
    through:'Favorites',
    timestamps:false
  })

  Article.belongsToMany(User,{
    through:'Favorites',
    timestamps:false
  })

  // 用户对用户  多对多

  User.belongsToMany(User,{
    through:'Follows',
    as:'followers',
    timestamps:false
  })


  // 文章和标签   多对多
  Article.belongsToMany(Tag,{
    through:'TagList',
    uniqueKey:false,
    timestamps:false
  })

  Tag.belongsToMany(Article,{
    through:'TagList',
    uniqueKey:false,
    timestamps:false
  })


}

const initDB = ()=>{
  return new Promise(async (resolve,reject)=>{
    try {
        // 数据库连接
       await dbconnection();
        // 初始化数据模型

        initRelation();

        // 同步

       await sequelize.sync({alter:true})

        resolve();
    } catch (error) {
      console.log(error);
      reject(error)
    }
  })
}

module.exports = initDB;



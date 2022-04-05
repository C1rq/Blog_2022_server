const {DataTypes} = require("sequelize");

const sequelize = require("../db/sequelize");

const Comment = sequelize.define("comment",{
 
  body:{ //   评论内容
    type:DataTypes.TEXT,
  }

})

module.exports = Comment
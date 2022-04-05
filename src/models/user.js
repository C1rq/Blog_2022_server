const {DataTypes} = require("sequelize");

const sequelize = require("../db/sequelize");

const User = sequelize.define("User",{
  email:{ //邮箱
    type:DataTypes.STRING,
    allowNull:false,    //是否能为空
    primaryKey:true,   //  是否为主键
  },
  username:{   //用户名
    type:DataTypes.STRING,
    allowNull:false,
    unique:false   //是否能重复
  },
  password:{  //密码
    type:DataTypes.STRING,
    allowNull:false,
  },

  avater:{ //头像
    type:DataTypes.TEXT,
    allowNull:true,
  },
  bio:{ //简介
    type:DataTypes.TEXT,
    allowNull:true,
  }

})

module.exports = User
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
  dialect:process.env.DB_DIALECT,
  host:process.env.DB_HOST,
  port:process.env.DB_PORT,
  logging:false
})


module.exports =  sequelize;
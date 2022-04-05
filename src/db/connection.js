const sequelize = require("./sequelize")


const DBconnection = async ()=>{
  return new Promise(async (resolve,reject)=>{
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      resolve();

    } catch (error) {
      console.error('Unable to connect to the database:', error);
      reject(error);
    }
  })

}


module.exports = DBconnection;
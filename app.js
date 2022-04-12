

require('dotenv').config({path:'.env'})
const express = require("express");
const initDB = require("./src/init/initDB")
const initServer = require("./src/init/initServer")
const initRoutes = require("./src/init/initRoutes")
const cors = require('cors')
const morgan = require("morgan")

const noMatchMiddleware = require("./src/middleware/404.middleware")

const errorMiddleware = require("./src/middleware/error.middlewar")

const app = express();

// 中间件
app.use(cors({credentials:true,origin:true}))    //跨域
app.use(express.json())    //解析 
app.use(morgan('tiny'))  // http 请求日志


// 静态服务  
app.use("/static",express.static("public"))


// 初始化路由
initRoutes(app);

// 404

app.use(noMatchMiddleware)
app.use(errorMiddleware)

const main = async ()=>{
  // 初始化数据库
  await initDB();
  // 初始化服务
  await initServer(app);

}
main();








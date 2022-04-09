const userRouter = require("../routes/users");
const followRouter = require("../routes/follow")
const tagRouter = require("../routes/tag")
const articleRouter = require("../routes/article")
const initRoutes = (app)=>{
  app.use('/api/v1/users',userRouter)
  app.use('/api/v1/follow',followRouter)
  app.use('/api/v1/tag',tagRouter)
  app.use('/api/v1/articles',articleRouter)


}

module.exports = initRoutes
const userRouter = require("../routes/users");
const followRouter = require("../routes/follow")
const tagRouter = require("../routes/tag")
const articleRouter = require("../routes/article")
const favoriteRouter = require("../routes/favorite")
const initRoutes = (app)=>{
  app.use('/api/v1/users',userRouter)
  app.use('/api/v1/follow',followRouter)
  app.use('/api/v1/tag',tagRouter)
  app.use('/api/v1/articles',articleRouter)
  app.use('/api/v1/favorite',favoriteRouter)

}

module.exports = initRoutes
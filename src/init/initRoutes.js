const userRouter = require("../routes/users");
const followRouter = require("../routes/follow")

const initRoutes = (app)=>{
  app.use('/api/v1/users',userRouter)
  app.use('/api/v1/follow',followRouter)

}

module.exports = initRoutes
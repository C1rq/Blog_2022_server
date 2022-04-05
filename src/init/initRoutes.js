const userRouter = require("../routes/users");


const initRoutes = (app)=>{
  app.use('/api/v1/users',userRouter)

  // app.get('/',(req,res)=>{
  //   res.json({
  //     name:'hello',
  //   })
  // })

}

module.exports = initRoutes
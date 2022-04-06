const Tag = require("../models/tag")

//    添加标签
module.exports.createTag = async (req,res,next)=>{
  try {
    const tag = await req.body.tag
    console.log(tag);
    let tagResult = await Tag.create({name:tag})
    console.log("dbtag",tagResult);
    res.status(200)
        .json({
          status:1,
          message:"创建标签成功",
          data:tagResult.dataValues
        })
   
  } catch (error) {
      next(error)
  }

}

// 获取标签
module.exports.getTags = async (req,res,next)=>{
  try {
        const tags = await Tag.findAll()
        const tagsBody =[]
        if(tags.length){
          for(const tag of tags){
            tagsBody.push(tag.dataValues.name)
          }
          console.log(tagsBody);
        }
       

        res.status(200)
            .json({
              status:1,
              message:"获取成功",
              data:tagsBody
            })
  } catch (error) {
      next(error)
  }

}
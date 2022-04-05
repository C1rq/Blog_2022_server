require("dotenv").config({path:'../../.env'})

const jwt = require("jsonwebtoken");

console.log(process.env.JWT_SECRET);

// token 加签
const  sign = async (username,email)=>{
  return new Promise((resolve,reject)=>{
    jwt.sign({
      username,
      email
    },process.env.JWT_SECRET,(err,token)=>{
      if(err){
        return reject(err);
      }
      resolve(token)
    })
  })

}


// 解签   验证

const decode = async (token)=>{
  return new Promise(async (resolve,reject)=>{
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
          return reject(err)
        }
        resolve(decoded)
    })
  })
}


module.exports = {sign,decode};

// test

// const test = async ()=>{
//   const data = {
//     username:'admin',
//     email:"admin@qq.com"
//   }

//   const {username,email} = data;

//   const token = await sign(username,email)
//   console.log('token is ' , token);
//   const de = await decode(token);
//   console.log('decode is' ,de);
// }
// test();
const md5 = require("md5")

const SALT = 'CRQ'

const md5Password = (password)=>{
  return new Promise((resolve,reject)=>{
    const md5PWD = md5(password+SALT);
    resolve(md5PWD)
  })
}


const matchPassword = (oldMd5PWD,password)=>{
  return new Promise((resolve,reject)=>{
    const newMd5PWD = md5(password+SALT);
    if(oldMd5PWD === newMd5PWD){
      resolve(true)
    }else{
      resolve(false)
    }
  })

}

module.exports = {md5Password,matchPassword}


// async function test1(){
//   const p = "abc";
//   const md5Pwd = await md5Password(p);
//   console.log('md5PWD',md5Pwd);
//   const match =await matchPassword(md5Pwd,'abc')
//   console.log(match);
// }
// test1();
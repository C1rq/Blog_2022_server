const slug = require('unique-slug')

module.exports.getSlug = ()=>{
  let slugRandom = slug();
  console.log(slugRandom);
  return slugRandom;
}
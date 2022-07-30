const mongoose = require("mongoose")

//もんごDBのメリットは、スキーマをたくさん作れる
//ポスト自体のidはmongoが勝手に作る
const postSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true,
  },
  desc : {
    type : String,
    max : 200,

  },
  img : {
    type : String,

  },
  likes : {
    type : Array,
    default : []
  }


}
,{timestamps: true}) 

module.exports = mongoose.model("Post",postSchema)
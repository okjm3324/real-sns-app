const router =require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")

//投稿を作成する
router.post("/",async (req,res) => {
  const newPost = new Post(req.body)

  try{
    const savedPost = await newPost.save()
    return res.status(200).json(savedPost)

  }catch (err) {
    return res.status(500).json(err)
  }
})

//投稿を更新する
router.put("/:id",async (req,res) => {

  try{
    const post = await Post.findById(req.params.id)

    if(req.body.userId === post.userId){
      await post.updateOne({
        $set : req.body
      })
      return res.status(200).json("投稿を更新しました")
    }else{
      return res.status(403).json("自分の投稿しか更新できません")
    }

  } catch(err){
    return res.status(500).json(err)

  }
  
})

//投稿を削除する
router.delete("/:id",async (req,res) => {
  const post = await Post.findById(req.params.id)

  if (req.body.userId === post.userId){
    try{
     await post.deleteOne()
      return res.status(200).json("投稿を削除しました")

    }catch(err){
      res.status(500).json(err)
    }

  }else{
    return res.status(403).json("自分の投稿ではないので削除できません")
  }
})

//投稿を取得する
router.get("/:id",async(req,res) => {
  try{
    const post = await Post.findById(req.params.id)
     return res.status(200).json(post)

  }catch (err){

  }
  

})



//特定の投稿にいいねをおす

router.put("/:id/like",async(req,res) => {
  try{
    const post = await Post.findById(req.params.id)
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({
        $push:{
          likes : req.body.userId,
        }
  
        
      })
      return res.status(200).json("いいねしました")
    }else{
      await post.updateOne({
        $pull: {
          likes: req.body.userId
        }
      })
      return res.status(403).json("いいねを取り除きました")
    }
  }catch(err){
    return res.status(500).json(err)
  }
 
})

//タイムラインを取得する
router.get("/timeline/:userId",async (req,res) => {
  const currentUser = await User.findById(req.params.userId)
  const userPosts = await Post.find({userId: currentUser._id})

  const friendPosts = await Promise.all(
    currentUser.followings.map((friendId) => {
      //ここ注意！！！findで{}でフィールド指定
      return Post.find({userId: friendId})
    })
  )
  return res.status(200).json(userPosts.concat(...friendPosts))

})

//プロフィール用タイムラインの取得
router.get("/profile/:username",async (req,res) => {
  try{
    const user = await User.findOne({username: req.params.username})
    const posts = await Post.find({userId: user._id})
    console.log("profile")
    return res.status(200).json(posts)
    
  }catch (err){
    return res.status(500).json(err)
  }
})


module.exports = router
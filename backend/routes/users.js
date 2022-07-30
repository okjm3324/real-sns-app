//ユーザーに関する情報を格納する
//EXPRESSの関数　Router登場 ()忘れないように
const router = require("express").Router()
const User = require("../models/User")

//CRUD
//クリエイトはもうauthでやったからいらん



//ユーザー情報の取得
 //タイムラインとか他人のツイート
//パラメータのidを取得して、該当するuserを返す
  // router.get("/:id", async (req,res)=>{
  //   try{
  //     const user = await User.findById(req.params.id)

  //     //usersからパスワード、アップデートを除いたotherを作る
  //     const {password,updatedAt,...other} = user._doc
  //     //otherを返す
  //     return res.status(200).json(other)

  //   }catch(err){
  //     return res.status(500).json(err)
  //   }

  // })

//クエリでユーザー情報を取得
router.get("/", async (req,res)=>{
  const userId = req.query.userId
  const username = req.query.username

  try{

    const user = userId 
    ? await User.findById(userId)
    : await User.findOne({username:username})


    //usersからパスワード、アップデートを除いたotherを作る
    const {password,updatedAt,...other} = user._doc
    //otherを返す
    return res.status(200).json(other)

  }catch(err){
    return res.status(500).json(err)
  }

})




//ユーザー情報の更新
router.put("/:id",async (req,res)=>{
 
    if (req.body.userId === req.params.id || req.body.isAdmin){
      try{
        const user = await User.findByIdAndUpdate(req.params.id,{
          //$setは全てのパラメータを指定するという意味
          $set : req.body,
        })
        res.status(200).json("ユーザー情報が更新されました")



    } catch(err){
      res.status(500).json(err)
    }

    }else{
      return res.status(403).json("あなたは自分のアカウントの時だけ情報だけ更新できます")
    }

    




  

})

//ユーザー情報の削除
router.delete("/:id",async (req,res)=>{
  
    if (req.body.userId === req.params.id || req.body.isAdmin){
      try{
      const user = await User.findByIdAndRemove(req.params.id)
        return res.status(200).json("削除しました")
     

      }catch(err){
       return res.status(500).json("削除に失敗しました")
      }

    
    }else{
     return res.status(500).json("あなたは自分のアカウントだけ削除できます")
    }
})



//*********ここが鬼門 */
//ユーザーのフォロー
router.put("/:id/follow",async (req,res) =>{
//自分かどうかを確かめる
if(req.body.userId !== req.params.id){
  try{
    //カレントユーザー、相手ユーザーを取得
    const user = await User.findById(req.params.id)
    const currentUser = await User.findById(req.body.userId)

    //相手のfollowerにカレントユーザーがいるか確かめる
    //もし、相手のフォロワーに自分がいなかったら・・・
    if(!user.followers.includes(req.body.userId)){
      await user.updateOne({
        $push:{
          followers:req.body.userId,
        }
      })

      await currentUser.updateOne({
        //この$マークはモード選択
        $push:{
          followings: req.params.id,

        }
      })
      return res.status(200).json("フォローしました")

    }else{
      //相手のフォロワーに自分がいた（すでにフォローしてた）
      return res.status(500).json("すでにフォローしています")
    }


  }catch (err){
    res.status(500).json(err)
  }


}else{

  return res.status(500).json("自分自身はフォローできません")
}





//相手followerに自分のuserIdを突っ込む
//カレントのfollowingに相手ユーザーのidを突っ込む

//params.idは相手のid 相手のページでフォローするから
  
})


//アンフォロー機能
router.put("/:id/unfollow",async (req,res)=>{
  if(req.body.userId !== req.params.id){
    try{
      //二つのユーザーをとってくる
      const user = await User.findById(req.params.id)
      const currentUser = await User.findById(req.body.userId)

      //userのフォロワーに自分がいるか
      if(user.followers.includes(req.body.userId)){
       await user.updateOne({
          $pull: {
            followers:req.body.userId,
          }
        })

       await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          }
        })

        return res.status(200).json("アンフォローに成功しました")

      }else{
        res.status(500).json("フォローしてないのでアンフォローできません")
      }



    }catch (err){
      res.status(500).json(err)
    }

  }else{
    return res.status(500).json("自分自身はアンフォローできません")
  }
  
})


//エクスポート方法がちょっと違う！
module.exports = router;
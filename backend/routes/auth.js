const router = require("express").Router()
const User = require("../models/User")

router.post("/register",async (req,res)=>{
  try{
    //モデルのインスタンスを生成する。Userの引数にリクエストでもらった値を各フィールドにセットする
   const newUser = await new User({
     username: req.body.username,
     email: req.body.email,
     password: req.body.password,
   })
   //なんで新しくuser宣言してんの？
   const user = await newUser.save()
   //全てがオーケーでuserをJson形式で返す。
   return res.status(200).json(user)


  } catch (err){
    return res.status(500).json(err)

  }
})

router.post("/login",async (req,res)=>{
  try{
    //reqのメルアドでobjを持ってくる
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(404).send("ユーザーが見つかりません")
    
    const vaildePassword = req.body.password === user.password
    if(!vaildePassword)return res.status(400).json("パスワードが違います")
      //ログインしょり
      
    return res.status(200).json(user)


    //reqのpassとobjのpassがあってルカみる

    //会ってたらログイン

    //違ったらパスが違います

  } catch(err){
    return res.status(500).json(err)
  }

})


module.exports = router

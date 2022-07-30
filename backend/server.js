const express = require("express")
const mongoose = require("mongoose")

const authRoute = require("./routes/auth")

const app = express()
const PORT = 5000
const userRoute = require("./routes/users.js")
const postsRoute = require("./routes/posts")
const uploadRoute = require("./routes/upload")
const path = require("path")
require("dotenv").config()

//データベース接続
mongoose.connect(process.env.MONGOURL).then(()=>{
  console.log("データベース接続中...")
}).catch((err)=>{
console.log(err)
})

//ミドルウェア
app.use("/images",express.static(path.join(__dirname, "public/images")))
app.use(express.json())
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts", postsRoute)
app.use("/api/upload", uploadRoute)

//　　'/’は私の作ったAPI,この「/」にアクセスすると「getメソッド発動」リク受けレス返す
app.get('/',(req,res)=>{
  //レスポンスのセンド関数でブラウザにレス返す
  res.send("hello expressssssssss")
})

//リッスンする　サーバでリクエストを待ち受けるよ
app.listen(PORT,()=>{
  console.log(`サーバに接続中...`)
})

const router = require("express").Router()
const multer = require("multer")

//ストレージを用意する
const storage = multer.diskStorage({
  destination : (req,file,cb) => {
    cb(null,"public/images")
  },
  filename: (req,file,cb) => {
    cb(null,req.body.name)
  }

})

const upload = multer({storage})

// 画像アップロードAPI
router.post("/",upload.single("file"),(req,res)=> {
  try{
    return res.status(200).json("画像アップロードに成功しました")
  }catch(err){
   return res.status(500).json(err)
  }
})


module.exports = router
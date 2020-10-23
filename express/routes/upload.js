var express = require("express");
var router = express.Router();
const multer = require("multer");
// const path = require('path')

const imgPath = __dirname + "/../upload";

const storage = multer.diskStorage({
    // 文件存储的位置
    destination: function (req, file, cb) {
        cb(null, imgPath);
    },
    // 文件重命名
    filename: function (req, file, cb) {
        // console.log(file)
        // let timeStamp = new Date().getTime()
        // const extname = path.extname(file.originalname)
        // cb(null, timeStamp + '.' + file.originalname.split(".")[1] + extname);
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), function (req, res, next) {
    console.log(req.file);
    res.send({
        code: 200,
        fileName: "http://127.0.0.1:3000/download?" + req.file.filename,
    });
});

module.exports = router;

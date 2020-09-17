const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const path = require('path');

const imgPath = __dirname + '/../upload'

// 下载
router.get('/', function (req, res, next) {
    let imgName = ''
    if (req.query) {
        for (const key in req.query) {
            const extname = path.extname(key)
            if (extname == '.jpg' || extname == '.png') {
                imgName = key
                break;
            }
        }
    }
    if (imgName != '') {
        res.download(imgPath + '/' + imgName);
    } else {
        next(createError(404))
    }
})

module.exports = router;

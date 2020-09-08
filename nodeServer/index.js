var express = require("express");

var app = express();

app.get("/", function (req, res) {
    res.send("你好");
});
app.post("/", function (req, res) {
    res.send({
        code: 200,
        msg: 520,
    });
});
app.post("/login", function (req, res) {
    res.send("hello");
});
app.post("/index", function (req, res) {
    res.send({
        code: 200,
        msg: "lzf 520",
    });
});

var server = app.listen(8888, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("收到请求，地址为 http://%s:%s", host, port);
});

var express = require("express");

var app = express();

app.post("/group_buying/userInfoLog.do", function (req, res) {
    // console.log(req.get("type"));
    // console.log(req.protocol);
    // console.log(req.body);
    res.send({
        code: 200,
        userInfo: [
            {
                image: "/123.png",
                name: "xiaowang",
                mobile_phone: "139123456789",
            },
        ],
    });
});

var server = app.listen(8888, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("服务开启，访问地址为 http://%s:%s", host, port);
});

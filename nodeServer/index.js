var express = require("express");

var app = express(); //公司的wx449630cb8e3d6318
//自己的wx6bf37e88bf8f41a9

app.post("/userInfoNessage.do", function (req, res) {
    let type = req.header("type");
    res.setHeader("Token", "123");
    switch (type) {
        case "LIST":
            res.send({
                code: 200,
            });
            break;

        default:
            break;
    }
});

app.post("/userInfoMerchant.do", function (req, res) {
    let type = req.header("type");
    res.setHeader("Token", "123");
    switch (type) {
        case "LIST":
            res.send({
                code: 200,
                data: {
                    list: [
                        {
                            id: 202,
                            code: null,
                            name: "李先生",
                            image: null,
                            merchant_type_id: null,
                            flag: "审核失败",
                            mobile_phone: "123545644",
                            fixed_phone: null,
                            card_no: null,
                            card_picture: null,
                            business_license: null,
                            province: "江西省",
                            city: "南昌市",
                            area: "西湖区",
                            address: "西湖幼儿园",
                            lon: 115.861497,
                            lat: 28.695299,
                            describe: null,
                            manage_range_id: null,
                            morning_manage_time: null,
                            evening_manage_time: null,
                            create_time: "2020-09-03 01:17:53",
                            audit_time: null,
                            openid: null,
                            merchant_name: null,
                            user_id: 210,
                            bank: null,
                            login_name: "10086",
                            password: "NWoZK3kTsExUV00Ywo1G5jlUKKs=",
                            pepol: 1,
                            integral: 940,
                        },
                        {
                            id: 201,
                            code: null,
                            name: "小先生",
                            image: null,
                            merchant_type_id: null,
                            flag: "审核成功",
                            mobile_phone: "1235456489",
                            fixed_phone: "",
                            card_no: null,
                            card_picture: null,
                            business_license: null,
                            province: "江西省",
                            city: "南昌市",
                            area: "东湖区",
                            address: "东湖幼儿园",
                            lon: 115.856248,
                            lat: 28.680779,
                            describe: null,
                            manage_range_id: null,
                            morning_manage_time: null,
                            evening_manage_time: null,
                            create_time: "2020-09-03 01:17:53",
                            audit_time: null,
                            openid: null,
                            merchant_name: null,
                            user_id: 210,
                            bank: null,
                            login_name: null,
                            password: null,
                            pepol: 0,
                            integral: null,
                        },
                    ],
                    count: 2,
                },
            });
            break;

        default:
            break;
    }
});

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
app.post("/userBank.do", function (req, res) {
    res.setHeader("Token", "123");

    let type = req.header("type");
    switch (type) {
        case "LIST":
            res.send({
                code: 200,

                data: {
                    list: [
                        {
                            id: 200,
                            bank_name: "招商银行",
                            bank_deposit: "南昌分行",
                            bank_code: "4321876512345678",
                            user_name: "小王",
                            mobile_phone: "13712345678",
                        },
                        {
                            id: 201,
                            bank_name: "建设银行",
                            bank_deposit: "九江分行",
                            bank_code: "12345678900987654321",
                            user_name: "小王",
                            mobile_phone: "13987654321",
                        },
                    ],
                },
            });
            return;
        case "FIND":
            res.send({
                code: 200,
                data: {
                    userBank: {
                        id: 200,
                        bank_name: "招商银行",
                        bank_deposit: "南昌分行",
                        bank_code: "4321876512345678",
                        user_name: "小王",
                        mobile_phone: "13712345678",
                    },
                },
            });
            return;
        case "DELETE":
            res.send({
                code: 200,
            });

            return;
        default:
            break;
    }

    if (req.header("type") == "UPDATE") {
        // UPDATE  ADD

        res.send({
            code: 200,

            data: {
                userBankId: "202",
                bank_name: "招商银行",
                bank_deposit: "九江分行",
                bank_code: "12345678900987654321",
                user_name: "小明",
                mobile_phone: "1001011",
            },
        });
    } else if (req.header("type") == "ADD") {
        res.send({
            code: 200,
            data: {
                bank_name: "建设银行",
                bank_deposit: "南昌分行",
                bank_code: "12345678901234567890",
                user_name: "小明",
                mobile_phone: "10086123",
            },
        });
    }
});

var server = app.listen(8888, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("服务开启，访问地址为 http://%s:%s", host, port);
});

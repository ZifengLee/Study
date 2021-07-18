const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        shop: {}, //店铺信息
        number: "", //会员数
        pageNum: 1,
        cashCoupons: "", //当前现金券
        time: "", //当日抽奖次数
        freeTime: 0, //免费次数
        showMask: false, //抽奖规则弹窗
        rule: "", //抽奖规则
        couponList: [], //活动列表
        winnerList: [], //中奖名单
        lotteryList: [], //抽奖奖品列表
        random: "", //各类奖品抽到的随机数
        trasn: 0, //旋转角度
        prise: "", // 奖品
        index: "", //奖品的序号
        name: "", //中奖的奖品名称
    },

    onLoad() {
        this.getCashCoupons();
        this.lunbochoujiang();
        this.getLottery();
    },

    onShow() {
        this.getLocation();
    },

    //获取用户位置信息
    getLocation: function () {
        var that = this;
        wx.getLocation({
            type: "wgs84",
            success(res) {
                console.log(res);
                const latitude = res.latitude;
                const longitude = res.longitude;

                //获取店家信息
                app.request(
                    "/customMerchant.do",
                    "SELECT",
                    {
                        lon: latitude,
                        lat: longitude,
                    },
                    (data) => {
                        console.log(data);
                        that.setData({
                            shop: data.data.list, //店铺信息
                            number: data.data.number, //店铺会员数
                        });

                        //活动专区列表
                        app.request(
                            "/event.do",
                            "LIST",
                            {
                                merchant_id: that.data.shop.id,
                            },
                            (data) => {
                                that.setData({
                                    couponList: data.data.list,
                                });
                            }
                        );
                    }
                );
            },
            fail: (err) => {
                wx.getSetting({
                    success: function (res) {
                        if (!res.authSetting["scope.userLocation"]) {
                            wx.showModal({
                                content: "请允许获取您的定位,不然将无法使用",
                                confirmText: "授权",
                                success: function (res) {
                                    if (res.confirm) {
                                        that.openSetting();
                                    } else {
                                        that.getLocation();
                                    }
                                },
                            });
                        } else {
                            //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                            wx.showModal({
                                title: "",
                                content: "请在系统设置中打开定位服务",
                                confirmText: "确定",
                                success: function (res) {},
                            });
                        }
                    },
                });
            },
        });
    },

    // 打开小程序设置获取授权
    openSetting: function () {
        wx.openSetting({
            success: (res) => {
                if (res.authSetting) {
                    this.getLocation();
                    this.setData({
                        main: true,
                    });
                }
            },
        });
    },

    //活动专区支付
    goToPay: function (e) {
        this.setData({
            freeTime: 1,
        });
    },

    //当前现金券
    getCashCoupons() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            this.setData({
                cashCoupons: data.data.customUser.money,
            });
        });
    },

    // 抽奖奖品列表
    getLottery() {
        app.request("/prizeSet.do", "LIST", {}, (data) => {
            this.setData({
                time: data.data.details.max_number, //当日抽奖次数
                rule: data.data.details.rule, //抽奖规则
                lotteryList: data.data.list, //抽奖奖品列表
            });
        });
    },

    //点击转盘旋转
    zhuanin: function () {
        app.request("/prizeSet.do", "LOTTERY", {}, (data) => {
            if (data.code === 200) {
                // console.log(data);
                this.setData({
                    prise: data.data.commodity.id,
                    freeTime: 0,
                });
                this.getCashCoupons();
                this.getLottery();
                for (let i = 0; i < this.data.lotteryList.length; i++) {
                    if (this.data.lotteryList[i].id === this.data.prise) {
                        this.data.index = i;
                        console.log(i);
                    }
                }

                let num = 0; //转盘旋转圈数
                let a = setInterval(() => {
                    this.setData({
                        trasn: this.data.trasn + 5,
                    });
                    if (360 <= this.data.trasn) {
                        this.data.trasn = 0;
                        num = num + 1;
                    }
                    if (num == 5) {
                        this.currinl();
                        clearInterval(a);
                    }
                }, 7);
            } else {
                wx.showToast({
                    title: data.message,
                    icon: "none",
                    duration: 1000,
                    mask: true,
                });
            }
        });
    },

    //随机整数[min,max]
    random: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    //开始抽奖
    currinl: function () {
        switch (this.data.index) {
            case 0:
                const chose = this.random(1, 100);
                if (chose > 50) {
                    this.data.random = this.random(0, 5);
                } else {
                    this.data.random = this.random(355, 360);
                }
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                console.log(this.data.name);
                break;

            case 7:
                this.data.random = this.random(40, 50);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;

            case 6:
                this.data.random = this.random(85, 95);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;

            case 5:
                this.data.random = this.random(130, 140);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;

            case 4:
                this.data.random = this.random(175, 185);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;

            case 3:
                this.data.random = this.random(220, 230);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;

            case 2:
                this.data.random = this.random(265, 275);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;

            case 1:
                this.data.random = this.random(310, 320);
                this.setData({
                    name: this.data.lotteryList[this.data.index].prize_name,
                });
                break;
            default:
                break;
        }

        let b = setInterval(() => {
            this.setData({
                trasn: this.data.trasn + 2,
            });
            if (this.data.random <= this.data.trasn) {
                wx.showToast({
                    title: "恭喜您中得" + this.data.name,
                    icon: "none",
                    duration: 2000,
                });
                clearInterval(b);
            }
        }, 14);
    },

    //轮播中抽奖名单
    lunbochoujiang: function () {
        app.request(
            "/prizeSet.do",
            "SELECT",
            {
                page_number: 1,
                page_count: 30,
            },
            (data) => {
                this.setData({
                    winnerList: data.data.list,
                });
            }
        );
    },

    // 打开活动规则
    openActivityRule() {
        this.setData({
            showMask: true,
        });
    },

    // 关闭活动规则
    colseActivityRule() {
        this.setData({
            showMask: false,
            showMMyMask: false,
        });
    },
});

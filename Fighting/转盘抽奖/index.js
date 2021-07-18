const app = getApp();

Page({
    data: {
        imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
        shop: {}, //店铺信息
        number: "", //会员数
        is_custom: 0, //是否是新用户 0为新用户
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
        buttonClicked: false, //避免多次点击
        goodsList: [], //商品列表
        page_number: 1, //页数
        allPage: 0, //总页数
    },

    onLoad() {
        this.getCashCoupons();
        this.lunbochoujiang();
        this.getLottery();
    },

    onShow() {
        this.setData({
            showMask: false,
            goodsList: [], //商品列表
            page_number: 1, //页数
        });
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
                        if (data.code === 200) {
                            that.setData({
                                shop: data.data.list, //店铺信息
                                number: data.data.number, //店铺会员数
                            });
                            app.setMerchantInfo(data.data.list);
                            //活动专区列表
                            app.request(
                                "/event.do",
                                "LIST",
                                {
                                    merchant_id: that.data.shop.id,
                                },
                                (data) => {
                                    if (data.code === 200) {
                                        that.setData({
                                            couponList: data.data.list,
                                        });
                                    }
                                }
                            );
                            that.getList();
                        }
                    }
                );
            },
            fail: (err) => {
                console.log(err);
                wx.getSetting({
                    success: function (res) {
                        if (!res.authSetting["scope.userLocation"]) {
                            wx.showModal({
                                content: "请允许获取您的定位,不然将无法使用",
                                confirmText: "授权",
                                success: function (res) {
                                    console.log(res);
                                    if (res.confirm) {
                                        console.log(
                                            "系统设置中打开定位服务授权"
                                        );
                                        that.openSetting();
                                    } else {
                                        console.log(
                                            "系统设置中打开定位服务取消"
                                        );
                                        that.getLocation();
                                    }
                                },
                            });
                        } else {
                            console.log("else进来了");
                            wx.showModal({
                                content: "请在系统设置中打开定位服务",
                                confirmText: "确定",
                                success: function (res) {
                                    console.log(res);
                                    if (res.confirm) {
                                        console.log(
                                            "系统设置中打开定位服务授权"
                                        );
                                        that.openSetting();
                                    } else {
                                        console.log(
                                            "系统设置中打开定位服务取消"
                                        );
                                        that.getLocation();
                                    }
                                },
                            });
                        }
                        // if (res.authSetting["scope.userLocation"] == true) {
                        //     console.log(666666);
                        //     //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
                        //     // wx.showModal({
                        //     //     content: "请在系统设置中打开定位服务",
                        //     //     confirmText: "确定",
                        //     //     success: function (res) {
                        //     //         console.log(res);
                        //     //         if (res.confirm) {
                        //     //             console.log(
                        //     //                 "系统设置中打开定位服务授权"
                        //     //             );
                        //     //             that.openSetting();
                        //     //         } else {
                        //     //             console.log(
                        //     //                 "系统设置中打开定位服务取消"
                        //     //             );
                        //     //             that.getLocation();
                        //     //         }
                        //     //     },
                        //     // });
                        // }
                    },
                });
            },
        });
    },

    // 打开小程序设置获取授权
    openSetting: function () {
        console.log("openSetting进来了");
        wx.openSetting({
            success: (res) => {
                console.log(res.authSetting["scope.userLocation"] + "进来了");
                if (res.authSetting["scope.userLocation"]) {
                    console.log("打开了定位");
                } else {
                    console.log("没有打开定位");
                    this.getLocation();
                }
            },
        });
    },

    //选择自提点
    pickUpPoint() {
        if (this.data.is_custom === 1) {
            wx.navigateTo({
                url: "/pages/zitidian/zitidian",
            });
        } else {
            app.showToast("请先授权登录~");
        }
    },

    // 获取滚动条当前位置
    onPageScroll: function (e) {
        if (e.scrollTop > 100) {
            this.setData({
                floorstatus: true,
            });
        } else {
            this.setData({
                floorstatus: false,
            });
        }
    },

    //回到顶部
    goTop: function (e) {
        // 一键回到顶部
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0,
            });
        } else {
            wx.showModal({
                title: "提示",
                content:
                    "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            });
        }
    },

    //活动专区支付
    goToPay: function (e) {
        var id = e.currentTarget.dataset.id;
        this.buttonClicked(this);
        app.request(
            "/customOrderForm.do",
            "ADDEVENT",
            {
                merchant_id: this.data.shop.id,
                event_id: id,
            },
            (data, code) => {
                if (data.code === 200) {
                    wx.requestPayment({
                        timeStamp: data.data.pay.data.pay_info.timeStamp,
                        nonceStr: data.data.pay.data.pay_info.nonceStr,
                        package: data.data.pay.data.pay_info.package,
                        signType: "MD5",
                        paySign: data.data.pay.data.pay_info.paySign,
                        success(res) {
                            app.showToast("微信支付成功");
                            this.setData({
                                freeTime: 1,
                            });
                        },
                        fail(err) {
                            app.showToast("支付失败");
                        },
                    });
                }
            }
        );
    },

    //当前现金券
    getCashCoupons() {
        wx.showLoading({
            title: "加载中",
            mask: true,
        });

        app.request("/customUser.do", "FIND", {}, (data, code) => {
            wx.hideLoading();
            this.setData({
                cashCoupons: data.data.customUser.money,
                is_custom: data.data.customUser.is_custom,
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
        this.buttonClicked(this);
        app.request("/prizeSet.do", "LOTTERY", {}, (data) => {
            if (data.code === 200) {
                this.setData({
                    prise: data.data.id,
                    freeTime: 0, //免费次数为0
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
                app.showToast(data.message);
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
                if (this.data.name === "谢谢参与") {
                    app.showToast(this.data.name);
                } else {
                    app.showToast("恭喜您中得" + this.data.name);
                }
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

    //避免多次点击
    buttonClicked: function () {
        var that = this;
        this.setData({
            buttonClicked: true,
        });
        setTimeout(function () {
            that.setData({
                buttonClicked: false,
            });
        }, 2000);
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

    //跳转至搜索页
    goSearch() {
        wx.navigateTo({
            url: "/pages/search/search",
        });
    },

    //获取商品列表
    reqGoodList(onSuccess) {
        app.request(
            "/customCommodity.do",
            "LIST",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
                merchant_id: this.data.shop.id, //商家ID
            },
            (data, code) => {
                if (data.code === 200) {
                    wx.hideLoading({});
                    onSuccess(data.data);
                }
            }
        );
    },

    //商品列表
    getList() {
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        this.reqGoodList((data) => {
            this.setData({
                goodsList: data.list,
                allPage: Math.ceil(data.count / app.getPageCount()),
            });
        });
    },

    // 上拉到底部时触发
    onReachBottom() {
        this.data.page_number++;
        if (this.data.page_number > this.data.allPage) {
            app.showToast("人家是有底线的~");
        } else {
            this.reqGoodList((data) => {
                this.setData({
                    goodsList: this.data.goodsList.concat(data.list), //将数组连接起来
                });
            });
        }
    },

    //跳转商品详情
    goodDetail(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/goodsDetails/goodsDetails?id=" + id,
        });
    },

    // 下拉加载
    onPullDownRefresh: function () {
        this.onLoad();
        this.getLocation();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});

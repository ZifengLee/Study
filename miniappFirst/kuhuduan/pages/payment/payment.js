const app = getApp();

Page({
    data: {
        merchantId: "", //扫描得到的商家ID
        merchantName: "", //商家名称
        inputValue: "", //输入框输入的内容
        flag: true,
        time: 3, //倒计时开始时间
        number: "0000", //提现数量
        carWidth: "90rpx",
        cardState: "first", //卡片状态
        // change:"",
        showClass: false, //是否翻转
        cardData: [], //翻牌后内容 后台中奖的金额数量及随机产生的金额数量
    },

    //通过options获得上个页面携带过来的数据
    onLoad: function (options) {
        //商家名称
        app.request(
            "/customMerchant.do",
            "FIND",
            {
                merchant_id: options.merchantId,
            },
            (data, code) => {
                this.setData({
                    merchantName: data.data.merchant_name,
                    merchantId: options.merchantId,
                });
            }
        );
        this.getUserinfo();
    },

    //用户现金券数量
    getUserinfo() {
        app.request("/customUser.do", "FIND", {}, (data, code) => {
            this.setData({
                cashCoupons: data.data.customUser.money,
            });
        });
    },

    //获得输入框的内容
    setInput(e) {
        this.setData({
            inputValue: e.detail.value,
        });
    },

    //显示遮罩层
    showMask() {
        var that = this;
        if (Number(this.data.inputValue) > 0) {
            if (Number(this.data.inputValue) > Number(this.data.cashCoupons)) {
                wx.showToast({
                    title: "现金券不足~",
                    icon: "none",
                    duration: 2000,
                });
                return;
            }
            //线下现金券支付
            app.request(
                "/customAccount.do",
                "PAYMENT",
                {
                    merchant_id: this.data.merchantId,
                    money: Number(this.data.inputValue),
                },
                (data, code) => {
                    if (data.code === 200) {
                        this.setData({ flag: false });
                        //设置倒计时
                        let time = 2;
                        var timer = setInterval(function () {
                            if (time === 0) {
                                clearInterval(timer); //变量为0停止定时器，
                                wx.switchTab({
                                    url: "/pages/my/my",
                                });
                            } else {
                                that.setData({
                                    time: time--,
                                });
                            }
                        }, 1000);
                    }
                }
            );
        } else {
            wx.showToast({
                title: "请正确输入提现数量！",
                icon: "none",
                duration: 2000,
                mask: false,
            });
            return;
        }
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },

    // 跳转到支付成功页面
    goToWithdraw() {
        wx.navigateTo({
            url: "/pages/withdraw/withdraw",
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

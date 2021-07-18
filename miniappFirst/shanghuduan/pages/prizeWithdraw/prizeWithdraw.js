const app = getApp();

Page({
    data: {
        cashCoupon: {}, //商家现金券信息
        cashCouponsList: [], //明细列表
        page_number: 1, //页数
        number: "", //总页数
        flag: true, //遮罩层隐藏
        minMoney: "", //最小提现数量
        rule: "", //提现规则
    },

    onLoad: function () {
        this.getMerchantAccount();
        this.cashCouponDetail();
    },

    //商家现金券信息
    getMerchantAccount() {
        app.request("/merchantAccount.do", "FINDPRIZE", {}, (data, code) => {
            this.setData({
                cashCoupon: data.data.integral, //现金券数量
                rule: data.data.rule, //提现规则
                minMoney: data.data.minMoney, //最小提现数量
            });
        });
    },

    //获取现金券明细
    reqCashCouponList(onSuccess) {
        app.request(
            "/merchantAccount.do",
            "PRIZEDETAIL",
            {
                page_number: this.data.page_number,
                page_count: app.getPageCount(),
            },
            (data, code) => {
                if (data.code === 200) {
                    wx.hideLoading({});
                    onSuccess(data.data);
                }
            }
        );
    },

    //现金券明细
    cashCouponDetail() {
        this.setData({
            page_number: 1, //重新进入页面时，要将页数置为初值
            withdrawList: [], //提现明细
        });
        wx.showLoading({
            title: "加载中",
            icon: "none",
            mask: true,
        });
        this.reqCashCouponList((data) => {
            this.setData({
                cashCouponsList: data.list,
                number: Math.ceil(data.count / app.getPageCount()),
            });
        });
    },

    //上拉到底部时触发
    onReachBottom() {
        this.setData({
            page_number: this.data.page_number + 1,
        });
        if (this.data.page_number > this.data.number) {
            wx.showToast({
                title: "人家是有底线的~",
                icon: "none",
                duration: 1000,
                mask: true,
            });
        } else {
            this.reqCashCouponList((data) => {
                this.setData({
                    cashCouponsList: this.data.cashCouponsList.concat(
                        data.list
                    ),
                });
            });
        }
    },

    // 携带参数跳转到提现页面
    goToApplyWithdraw() {
        wx.navigateTo({
            url:
                "/pages/applyWithdraw/applyWithdraw?pendingWithdrawal=" +
                this.data.cashCoupon.prize_money +
                "&type=2" +
                "&minMoney=" +
                this.data.minMoney,
        });
    },

    //显示遮罩层
    showMask() {
        this.setData({
            flag: false,
        });
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        this.onLoad();
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});

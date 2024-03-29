const app = getApp();

Page({
    data: {
        moneyAmount: {}, //商家金额信息
        integralList: [], //积分明细列表
        page_number: 1, //页数
        page_count: 10, //条数
        number: "", //总页数
        flag: true, //遮罩层隐藏
        minMoney:"",//最小提现数量
        rule: "",//提现规则
    },

    onLoad: function () {
        this.getMerchantAccount();
        this.integralDetail();
    },

    //商家积分信息
    getMerchantAccount() {
        app.request("/merchantAccount.do", "FINDORDER", {}, (data, code) => {
            // console.log(data);
            this.setData({
                moneyAmount: data.data.integral,//金额数量
                rule: data.data.rule,//提现规则
                minMoney:data.data.minMoney,//最小提现数量
            });
        });
    },

    // 提现规则
    rule() {
        wx.showModal({
            title: "提现规则",
            content: this.data.rule,
            showCancel: false,
            confirmText: "知道啦！",
        });
    },

    //积分明细
    integralDetail() {
        this.setData({
            page_number: 1, //重新进入页面时，要将页数置为初值
            withdrawList: [], //提现明细
        });
        app.request(
            "/merchantAccount.do",
            "ORDERDETAIL",
            {
                page_number: this.data.page_number,
                page_count: this.data.page_count,
            },
            (data, code) => {
                wx.hideLoading({
                    success: (res) => {
                        this.setData({
                            integralList: data.data.list,
                            number: Math.ceil(
                                data.data.count / this.data.page_count
                            ),
                        });
                    },
                });
            }
        );
    },

    // 滚动到scroll底部时触发
    scrolltolower() {
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
            app.request(
                "/merchantAccount.do",
                "LOAD",
                {
                    page_number: this.data.page_number,
                    page_count: this.data.page_count,
                },
                (data, code) => {
                    wx.hideLoading({
                        success: (res) => {
                            this.setData({
                                integralList: this.data.integralList.concat(
                                    data.data.list
                                ),
                                number: Math.ceil(
                                    data.data.count / this.data.page_count
                                ),
                            });
                            console.log();
                        },
                    });
                }
            );
        }
    },

    // 携带参数跳转到提现页面
    goToApplyWithdraw() {
        wx.navigateTo({
            url:
                "/pages/applyWithdraw/applyWithdraw?pendingWithdrawal=" +
                this.data.moneyAmount.order_money + "&type=3"+"&minMoney="+this.data.minMoney,
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
});

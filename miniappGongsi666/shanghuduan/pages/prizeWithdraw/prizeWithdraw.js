const app = getApp();

Page({
    data: {
        cashCoupon: {}, //商家现金券信息
        cashCouponlList: [], //明细列表
        page_number: 1, //页数
        page_count: 10, //条数
        number: "", //总页数
        type: 1,//0为没有抽奖权限，1为有抽奖权限
        flag: true, //遮罩层隐藏
        minMoney:"",//最小提现数量
        rule: "",//提现规则
    },

    onLoad: function () {
        this.getMerchantAccount();
        this.integralDetail();
    },

    //现金券信息
    getMerchantAccount() {
        app.request("/merchantAccount.do", "FINDPRIZE", {}, (data, code) => {
            // console.log(data);
            this.setData({
                cashCoupon: data.data.integral,//现金券数量
                rule: data.data.rule,//提现规则
                minMoney:data.data.minMoney,//最小提现数量
            });
        });
    },

    //现金券明细
    integralDetail() {
        this.setData({
            page_number: 1, //重新进入页面时，要将页数置为初值
            withdrawList: [], //提现明细
        });
        app.request(
            "/merchantAccount.do",
            "PRIZEDETAIL",
            {
                page_number: this.data.page_number,
                page_count: this.data.page_count,
            },
            (data, code) => {
                wx.hideLoading({
                    success: (res) => {
                        this.setData({
                            cashCouponlList: data.data.list,
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
                this.data.cashCoupon.prize_money+"&type=2"+"&minMoney="+this.data.minMoney,
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

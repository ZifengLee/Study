const app = getApp();

Page({
    data: {
        integral: {}, //商家积分
        integralList: [], //积分明细列表
        page_number: 1, //页数
        page_count: 10, //条数
        number: "", //总页数
        type:0,//能否抽奖提现的标记
        flag: true, //遮罩层隐藏
        rule:"",//提现规则
    },

    onLoad: function () {
        this.getMerchantAccount();
        this.integralDetail();
    },

    //商家积分信息
    getMerchantAccount() {
        app.request("/merchantAccount.do", "FIND", {}, (data, code) => {
            // console.log(data);
            this.setData({
                integral: data.data.integral,
                rule: data.data.rule,
            });
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
            "LOAD",
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
                "/pages/applyWithdraw/applyWithdraw?integral=" +
                this.data.integral.integral,
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

const app = getApp();

Page({
    data: {
        Mobile_phone: "",
        userinfoAccount_money: "",
        userinfoAccount_team: "",
        withdrawList: [], //提现明细
        page_number: 1, //页数
        page_count: 4, //条数
        number: "", //总页数
    },

    onShow: function () {
        this.getUserInfo();
        this.getUserTeam();
        this.withdrawDetail();
    },

    //用户信息
    getUserInfo() {
        app.request("/userInfo.do", "SELECT", {}, (data, code) => {
            // console.log(data);
            this.setData({
                Mobile_phone: data.data.userInfo.mobile_phone,
            });
        });
    },

    //提成及团队信息
    getUserTeam() {
        app.request("/userAccount.do", "SELECT", {}, (data, code) => {
            this.setData({
                userinfoAccount_money: data.data.userInfo.balance,
                userinfoAccount_team: data.data.userInfo.count,
            });
        });
    },

    //提现明细
    withdrawDetail() {
        app.request(
            "/userInfo.do",
            "LOAD",
            {
                page_number: this.data.page_number,
                page_count: this.data.page_count,
            },
            (data, code) => {
                wx.hideLoading({
                    success: (res) => {
                        this.setData({
                            withdrawList: this.data.withdrawList.concat(
                                data.data.list
                            ),
                            number: Math.ceil(
                                data.data.count / this.data.page_count
                            ),
                        });
                    },
                });
            }
        );
    },

    //页面隐藏时数据清空
    onHide: function () {
        this.setData({
            Mobile_phone: "",
            userinfoAccount_money: "",
            userinfoAccount_team: "",
            withdrawList: [], //提现明细
        });
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
            this.withdrawDetail();
        }
    },

    //跳转到个人设置页面
    goToPersonSet() {
        wx.navigateTo({
            url: "/pages/personSet/personSet",
        });
    },

    //跳转到提现页面
    goToWithdraw() {
        wx.navigateTo({
            url: "/pages/withdraw/withdraw",
        });
    },
});

const app = getApp();

Page({
    data: {
        unWithdraw: "", //待提现积分
        inputValue: "", //输入框输入的内容
        flag: true,
        time: 3, //倒计时开始时间
        number:"0000",//提现数量
    },

    //通过options获得上个页面携带过来的数据
    onLoad: function (options) {
        this.setData({
            unWithdraw: options.integral,
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
        if (Number(this.data.inputValue*10000) > 0) {
            if( Number(this.data.inputValue*10000)>Number(this.data.unWithdraw)){
                wx.showToast({
                    title: "积分数量不足~",
                    icon: "none",
                    duration: 2000,
                });
                return;
            }
            //商家提现
            app.request(
                "/merchantCustom.do",
                "UPDATE",
                {
                    integral: this.data.inputValue*10000,
                },
                (data, code) => {
                    if (code === 644) {
                        wx.showToast({
                            title: "提现数量不能少于400",
                            icon: "none",
                            duration: 2000,
                        });
                        return;
                    }
                    if (code === 623) {
                        wx.showToast({
                            title: "提现数量需为整数",
                            icon: "none",
                            duration: 2000,
                        });
                        return;
                    }
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
            );
        } else {
                wx.showToast({
                    title: "请正确输入提现数量！",
                    icon: "none",
                    duration: 2000,
                });
                return;
        }
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },

    // 跳转到提现成功页面
    goToWithdraw() {
        wx.navigateTo({
            url: "/pages/withdraw/withdraw",
        });
    },
});

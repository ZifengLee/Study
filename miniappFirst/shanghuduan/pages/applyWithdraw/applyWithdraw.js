const app = getApp();

Page({
    data: {
        pendingWithdrawal: "", //待提现数量
        type: "", //提现类型 1为扫码提现，2为抽奖提现，3为订单提现
        inputValue: "", //输入框输入的内容
        requestType: "", //请求类型
        flag: true, //控制遮罩层是否显示
        time: 3, //倒计时开始时间
    },

    //通过options获得上个页面携带过来的数据
    onLoad: function (options) {
        this.setData({
            pendingWithdrawal: options.pendingWithdrawal, //待提现
            type: options.type, //提现类型 1为扫码提现，2为抽奖提现，3为订单提现
        });

        if (Number(this.data.type) == 1) {
            this.data.requestType = "SCANCASH";
            return;
        }
        if (Number(this.data.type) == 2) {
            this.data.requestType = "PRIZECASH";
            return;
        }
        if (Number(this.data.type) == 3) {
            this.data.requestType = "ORDERCASH";
            return;
        }
    },

    //获得输入框的内容
    setInput(e) {
        this.setData({
            inputValue: e.detail.value,
        });
    },

    //提示
    showToast: function (title) {
        wx.showToast({
            title: title,
            icon: "none",
            duration: 2000,
        });
        this.setData({
            inputValue: "",
        });
    },

    //显示遮罩层
    showMask() {
        var that = this;
        if (this.data.inputValue.length === 0) {
            this.setData({
                inputValue: 1,
            });
        }
        if (Number(this.data.inputValue) > 0) {
            if (
                Number(this.data.inputValue) >
                Number(this.data.pendingWithdrawal)
            ) {
                this.showToast("积分数量不足~");
                return;
            }
            //提现
            app.request(
                "/merchantCustom.do",
                this.data.requestType,
                {
                    money: this.data.inputValue,
                },
                (data, code) => {
                    if (code !== 200) {
                        this.showToast(data.data.message);
                        return;
                    } else {
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
            this.showToast("请正确输入提现数量!");
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

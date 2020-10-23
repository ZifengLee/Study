const app = getApp();

Page({
    data: {
        store: {}, //店铺信息
        all_integral:'',//积分总数
        flag: true, //遮罩层隐藏
        targetData: "", //公告详情
        noticeList: [], //公告信息
        mobile_phone: "", //客服电话
    },

    onLoad: function (options) {
        this.merchantCustom();
    },

    onShow: function () {
        this.Announce();
        // this.merchantCustom();
    },

    //商家信息
    merchantCustom() {
        app.request("/merchantCustom.do", "DETAIL", {}, (data, code) => {
            // console.log(data);
            this.setData({
                store: data.data.data,
                all_integral:data.data.all_integral,
                // integral: data.data.all_integral,//积分补贴
            });
        });
    },

    // 公告信息
    Announce() {
        app.request("/merchantMessage.do", "LIST", {}, (data, code) => {
            this.setData({
                noticeList: data.data.list,
            });
        });
    },

    //积分提现
    goToScanWithdraw() {
        wx.navigateTo({
            url: "/pages/scanWithdraw/scanWithdraw",
        });
    },

    //抽奖提现
    goToPrizeWithdraw() {
        wx.navigateTo({
            url: "/pages/prizeWithdraw/prizeWithdraw",
        });
    },

    //订单提现
    goToOrderWithdraw() {
        wx.navigateTo({
            url: "/pages/orderWithdraw/orderWithdraw",
        });
    },

    //设置
    goToSetting() {
        wx.navigateTo({
            url: "/pages/setting/setting",
        });
    },

    // 联系客服
    WePhone() {
        var that = this;
        app.request("/userInfo.do", "FIND", {}, (data, code) => {
            this.setData({
                mobile_phone: data.data.mobile_phone,
            });
            if (data.code == 200) {
                wx.showModal({
                    title: "客服电话",
                    content: this.data.mobile_phone,
                    showCancel: false,
                    confirmText: "拨打电话",
                    success: function (res) {
                        wx.makePhoneCall({
                            phoneNumber: that.data.mobile_phone,
                        });
                    },
                });
            }
        });
    },

    //显示遮罩层
    showMask(e) {
        this.setData({
            flag: false,
            targetData: e.currentTarget.dataset.item.detail,
        });
    },

    // 关闭遮罩层
    closeMask() {
        this.setData({ flag: true });
    },
});

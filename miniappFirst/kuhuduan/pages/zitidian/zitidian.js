const app = getApp();
Page({
    data: {
        page_number: 1,
        list: [],
        defaultId: -1,
    },

    onLoad: function (options) {
        this.getMerchant();
    },

    // 获取商家
    getMerchant() {
        //不存在的时候取默认附近的第一个
        wx.getLocation({
            type: "wgs84", //此类型为默认值，返回 gps 坐标
            success: (res) => {
                app.request(
                    "/customMerchant.do",
                    "LIST",
                    {
                        page_number: 1,
                        page_count: 9999,
                        lon: res.longitude,
                        lat: res.latitude,
                    },
                    (data) => {
                        data.data.list.forEach((item) => {
                            if (data.data.default === item.id) {
                                item.selected = "success_no_circle";
                            } else {
                                item.selected = "circle";
                            }
                        });

                        this.setData({
                            defaultId: data.data.default,
                            list: data.data.list,
                        });
                    }
                );
            },
        });
    },

    //选择设为默认自提点
    bindSelected(e) {
        if (e.currentTarget.dataset.item.id === this.data.defaultId) {
            return;
        }
        app.request(
            "/customMerchant.do",
            "DEFAULT",
            {
                id: e.currentTarget.dataset.item.id,
            },
            () => {
                wx.showModal({
                    title: "设置当前自提点",
                    content: "您是否要将默认自提点设置成当前自提点?",
                    success: (res) => {
                        if (res.confirm) {
                            app.setMerchantInfo(e.currentTarget.dataset.item);
                            this.getMerchant();

                            setTimeout(() => {
                                wx.navigateBack({
                                    delta: 1,
                                });
                            }, 2000);
                        } else {
                            wx.showToast({
                                title: "已取消设置",
                                icon: "none",
                                duration: 1000,
                                mask: true,
                            });
                        }
                    },
                });
            }
        );
    },
});

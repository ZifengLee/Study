//app.js
App({
    data: {
        orderInfo: null, //这个是订单信息的对象。
        inLogging: true,

        //本地地址
        imgbaseUrl: "http://192.168.3.3:8081/img/",
        baseUrl: "http://192.168.3.3:8081/group_buying",

        //线上地址
        // imgbaseUrl: "https://xiao.ncmfz.cn/img/",
        // baseUrl: "https://xiao.ncmfz.cn/group_buying",

        //新线上地址
        // imgbaseUrl: "https://www.jxcloudlight.com/img/",
        // baseUrl: "https://www.jxcloudlight.com/group_buying",
    },

    getPageCount() {
        return 10;
    },

    //设置商家信息
    setMerchantInfo(merchantInfo) {
        wx.setStorageSync("merchantInfo", merchantInfo);
    },

    //得到商家信息
    getMerchantInfo(merchantFun) {
        const merchant = wx.getStorageSync("merchantInfo");

        if (merchant) {
            merchantFun(merchant);
            return;
        }
        //不存在的时候取默认附近的第一个
        wx.getLocation({
            type: "wgs84",
            success: (res) => {
                this.request(
                    "/customMerchant.do",
                    "LIST",
                    {
                        page_number: 1,
                        page_count: 1,
                        lon: res.longitude,
                        lat: res.latitude,
                    },
                    (data) => {
                        this.setMerchantInfo(data.data.list[0]);
                        merchantFun(data.data.list[0]);
                    }
                );
            },
        });
    },

    //登录，用code换取数据
    onLaunch: function (options) {
        wx.login({
            success: (res) => {
                // console.log(res);
                this.request2(
                    "/customUser.do",
                    "LOGIN_MIN_APP",
                    {
                        code: res.code,
                    },
                    (data) => {
                        // console.log(data);
                    }
                );
            },
        });
    },

    request(url, requestType, requestData, callbackOnSuccess) {
        while (this.data.inLogging) {
            setTimeout(() => {
                this.request(url, requestType, requestData, callbackOnSuccess);
            }, 500);
            return;
        }

        this.request2(url, requestType, requestData, callbackOnSuccess);
    },

    request2(url, requestType, requestData, callbackOnSuccess) {
        const requestHeader = {
            type: requestType,
        };
        const token = wx.getStorageSync("token");
        if (token) requestHeader.token = token;
        //发起网络请求
        wx.request({
            url: this.data.baseUrl + url,
            method: "POST",
            header: requestHeader,
            data: requestData,
            success: (res) => {
                if (res.data.code >= 300) {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none",
                        duration: 2000,
                        mask: true,
                    });
                }
                if (res.data.code === 605 || res.data.code === 602) {
                    wx.navigateTo({ url: "/pages/login/login" });
                }

                if (res.header.Token) {
                    wx.setStorageSync("token", res.header.Token);
                }
                callbackOnSuccess(res.data, res.data.code, res);
                this.data.inLogging = false;
            },
        });
    },
});

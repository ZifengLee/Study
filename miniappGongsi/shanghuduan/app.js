//app.js
App({
    data: {
        //本地地址
        imgbaseUrl: "http://192.168.3.3:8081/img/",
        baseUrl: "http://192.168.3.3:8081/group_buying",

        //线上地址
        // imgbaseUrl: "https://xiao.ncmfz.cn/img/",
        // baseUrl: "https://xiao.ncmfz.cn/group_buying",
        code: null,
    },

    onLaunch: function () {
        let that = this;
        console.log(this);
        wx.login({
            success: (res) => {
                // console.log(this);
                // that.setData({
                //     code: res.code
                // })
                that.data.code = res.code;
                console.log(that.data);
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
            // "content-type": "application/json",
        };
        const token = wx.getStorageSync("token");
        // console.log(token)
        if (token) {
            requestHeader.token = token;
        }
        //发起网络请求
        wx.request({
            url: this.data.baseUrl + url,
            method: "POST",
            header: requestHeader,
            data: requestData,
            success: (res) => {
                if (res.data.code != 200) {
                    wx.showToast({
                        title: res.data.message,
                        icon: "none",
                        duration: 2000,
                        mask: true,
                    });
                }
                // if (
                // 	res.statusCode === 602 ||
                // 	res.statusCode === 999 ||
                // 	res.statusCode === 605
                // ) {
                // 	this.data.inLogging = false;
                // 	wx.redirectTo({ url: "/pages/login/login" });
                // }
                if (res.header.Token) {
                    wx.setStorageSync("token", res.header.Token);
                } else {
                    wx.redirectTo({
                        url: "/pages/login/login",
                    });
                }
                callbackOnSuccess(res.data, res.data.code, res);
            },
        });
    },
});

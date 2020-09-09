//app.js
App({
    data: {
        baseUrl: 'http://127.0.0.1:8888'
    },
    onLaunch: function () {
        var that = this;
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                console.log(that);

                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                // wx.request({
                //     url: 'http://127.0.0.1:8888',
                //     header: {
                //         'content-type': 'application/json'
                //     },
                //     success(res) {
                //         console.log(res);
                //     }
                // });

                that.request(
                    '/',
                    'login',
                    {},
                    (data, code, res) => {
                        //     console.log(1);
                        //     console.log(data);
                        //     console.log(2);
                        //     console.log(code);
                        //     console.log(3);
                        //     console.log(res);
                    }
                )
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null
    },

    request(url, requestType, requestData, callbackOnSuccess) {
        const requestHeader = {
            type: requestType,
        };
        // const token = wx.getStorageSync("token");
        // console.log(token)
        // if (token) requestHeader.token = token;
        //发起网络请求
        wx.request({
            url: this.data.baseUrl + url,
            method: "POST",
            header: requestHeader,
            data: requestData,
            success: (res) => {
                // if (res.data.code != 200) {
                //     wx.showToast({
                //         title: res.data.message,
                //         icon: "none",
                //         duration: 2000,
                //         mask: true,
                //     });
                // }
                // if (res.header.Token) {
                //     wx.setStorageSync("token", res.header.Token);
                // }
                callbackOnSuccess(res.data, res.data.code, res);
            },
        });
    }
})
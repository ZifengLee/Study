// pages/test8/test8.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

     //获取手机号码
    getPhoneNumber: function (e) {
        var that = this;
        console.log(e.detail.errMsg == "getPhoneNumber:ok");
        console.log(e.detail);

        if (e.detail.errMsg == "getPhoneNumber:ok") {
            wx.request({
                // url: 'http://localhost/index/users/decodePhone',
                data: {
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv,
                    sessionKey: that.data.session_key,
                    uid: "",
                },
                method: "post",
                success: function (res) {
                    console.log(res);
                }
            })
        }
    },
})
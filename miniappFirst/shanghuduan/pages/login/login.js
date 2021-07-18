const app = getApp();

Page({
    data: {
        login_name: "", //帐号
        password: "", //密码
        flag: true, //显示隐藏密码
    },

    // 获取输入账号
    usernameInput: function (e) {
        this.setData({
            login_name: e.detail.value,
        });
    },

    // 获取输入密码
    passwordInput: function (e) {
        this.setData({
            password: e.detail.value,
        });
    },

    //显示隐藏密码
    hidePassword: function () {
        this.setData({
            flag: !this.data.flag,
        });
    },

    //提示
    showToast(title) {
        wx.showToast({
            title: title, //提示文字
            duration: 2000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
            icon: "warn", //图标，支持"success"、"loading"
        });
    },

    // 登录处理
    login: function () {
        var that = this;
        if (this.data.login_name.length === 0) {
            this.showToast("账号不能为空");
            return;
        }
        if (this.data.password.length === 0) {
            this.showToast("密码不能为空");
            return;
        }
        wx.login({
            success: (res) => {
                app.request(
                    "/merchantLogin.do",
                    "LOGIN",
                    {
                        code: res.code,
                        login_name: that.data.login_name,
                        password: that.data.password,
                    },
                    (data, code) => {
                        if (code === 200) {
                            wx.switchTab({
                                url: "/pages/index/index",
                            });
                        }
                    }
                );
            },
        });
    },
});

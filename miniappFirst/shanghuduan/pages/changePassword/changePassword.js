const app = getApp()

Page({
    //提示
    showToast(title) {
        wx.showToast({
            title: title, //提示文字
            duration: 2000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
            icon: "warn", //图标，支持"success"、"loading"
        });
    },

    //修改登录密码
    formSubmit(e) {
        const value = e.detail.value;
        if (value.oldPassword == '') {
            this.showToast("请输入旧密码");
            return;
        }
        if (value.newPassword1 == '') {
            this.showToast("请填写新密码");
            return;
        }
        if (value.newPassword2 == '') {
            this.showToast("请再次输入新密码");
            return;
        }
        if (value.newPassword1 !== value.newPassword2) {
            wx.showModal({
                title: "温馨提示",
                content: "输入的密码不一致！",
                showCancel: false,
                confirmText: "知道啦！",
            });
            return;
        }

        app.request(
            '/merchantCustom.do',
            'MODIFYPASSWORD',
            {
                old_password: value.oldPassword,
                password: value.newPassword1,
            },
            (data, code) => {
                wx.navigateTo({
                    url: '/pages/setting/setting'
                })
            }
        )
    },
})
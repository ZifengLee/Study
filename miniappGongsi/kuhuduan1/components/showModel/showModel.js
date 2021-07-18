// components/showModel/showModel.js
Component({

    /**
     * 页面的初始数据
     */
    data: {
        // showModal: false,
        textV: ''
    },

    properties: {
        showModal: {
            type: 'Boolean',
            default: false
        },
    },

    methods: {
        /**
         * 控制显示
         */
        eject: function() {
            this.setData({
                showModal: true
            })
        },

        /**
         * 点击返回按钮隐藏
         */
        back: function() {
            this.setData({
                showModal: false
            })
            wx.showToast({
                title: '请填写取货手机号,不然我们将无法确认收货人',
                icon: 'none',
                duration: 1500,
            });
        },

        /**
         * 获取input输入值
         */
        wish_put: function(e) {
            this.setData({
                textV: e.detail.value
            })
        },

        /**
         * 点击确定按钮获取input值并且关闭弹窗
         */
        ok: function() {
            // console.log(this.data.textV)
                // 判断收货电话是否是正确的格式
            // var phonetel = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
            if (!this.data.textV) {
                wx.showToast({
                    title: '请先填写您的收货电话',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                });
                this.setData({
                    showModel: true
                })
                return false;
            }
            //  else if (!phonetel.test(this.data.textV)) {
            //     wx.showToast({
            //         title: '请检查您的电话号格式',
            //         icon: 'none',
            //         duration: 1500,
            //         mask: false,
            //     });
            //     return false;
            // }
             else {
                this.triggerEvent("showModalSuccess", this.data.textV);
                this.setData({
                    showModal: false
                })
            }

        },
    }
})
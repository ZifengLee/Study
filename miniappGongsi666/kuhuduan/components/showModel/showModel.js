import WxValidate from "../../utils/WxValidate.js"; //引入数据校验的文件
Component({
    /**
     * 页面的初始数据
     */
    lifetimes: {
        attached: function () {
            // 在组件实例进入页面节点树时执行
            this.initValidate();
        },
    },
    data: {
        inputValue: "", //获取input输入值
    },

    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
    },

    properties: {
        showModal: {
            type: "Boolean",
            default: false,
        },

        //页面的数据传到组件
        show: {
            type: Number,
            value: "",
            observer: function (newVal) {
                this.setData({
                    inputValue: newVal,
                });
            },
        },
    },

    methods: {
        /**
         * 点击返回按钮隐藏
         */
        back: function () {
            this.setData({
                showModal: false,
            });
            // if (this.data.inputValue.length === 0) {
            //     wx.showToast({
            //         title: "请填写取货手机号,不然我们将无法确认收货人",
            //         icon: "none",
            //         duration: 1500,
            //     });
            // }
        },

        /**
         * 获取input输入值
         */
        wish_put: function (e) {
            this.setData({
                inputValue: e.detail.value,
            });
        },

        //提示
        showToast(title) {
            wx.showToast({
                title: title, //提示文字
                duration: 1500, //显示时长
                mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false
                icon: "none", //图标，支持"success"、"loading"
            });
        },

        initValidate() {
            const rules = {
                inputValue: {
                    required: true,
                    tel: true,
                },
            };
            const message = {
                inputValue: {
                    required: "请输入手机号码",
                    tel: "手机号码错误",
                },
            };
            //实例化当前的验证规则和提示消息
            this.WxValidate = new WxValidate(rules, message);
        },

        //点击确定按钮获取input值并且关闭弹窗
        ok: function () {
            // 判断收货电话是否是正确的格式
            const value = this.data.inputValue;
            // checkForm验证的是一个对象
            if (!this.WxValidate.checkForm({ inputValue: value })) {
                //表单元素验证不通过，此处给出相应提示
                let error = this.WxValidate.errorList[0];
                this.showToast(error.msg);
                return;
            }
            if (this.data.inputValue.length === 0) {
                wx.showToast({
                    title: "请填写取货手机号,不然我们将无法确认收货人",
                    icon: "none",
                    duration: 1500,
                    mask: false,
                });
                this.setData({
                    showModel: true,
                });
                return false;
            } else {
                this.triggerEvent("showModalSuccess", this.data.inputValue);
                this.setData({
                    showModal: false,
                });
            }
        },
    },
});

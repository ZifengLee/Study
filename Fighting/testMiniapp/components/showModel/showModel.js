// const app = getApp();
import WxValidate from "../../utils/WxValidate.js";
Component({
    lifetimes: {
        attached: function () {
            // 在组件实例进入页面节点树时执行
            this.initValidate();
        },
    },
    data: {
        inputValue: "", //获取input输入
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
                if (newVal === 0) {
                    this.setData({
                        inputValue: "",
                    });
                } else {
                    this.setData({
                        inputValue: newVal,
                    });
                }
            },
        },
    },
    methods: {
        back: function () {
            this.setData({
                showModal: false,
            });
        },
        wish_put: function (e) {
            this.setData({
                inputValue: e.detail.value,
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
                wx.showToast({
                  title: error.msg,
                })

                //     return;
                // }
                // if (this.data.inputValue.length === 0) {
                //     app.showToast("请填写取货手机号,不然我们将无法确认收货人");
                //     this.setData({
                //         showModel: true,
                //     });
                //     return false;
            } else {
                this.triggerEvent("showModalSuccess", this.data.inputValue);
                this.setData({
                    showModal: false,
                });
            }
        },
    },
});

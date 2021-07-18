import WxValidate from "../../utils/WxValidate.js";
const app = getApp();

Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        merchant_name: "", //商铺名称
        address: "", //商铺地址
        mobile_phone: "", //商铺电话
        name: "", //店主名称
        imageShangpu: [], //商铺图片
        imageDianzhuzheng: [], //店主证件照正面
        imageDianzhufan: [], //店主证件照反面
        imageYingyezhao: [], //营业执照
        card_name: "", //卡主姓名
        bank: "", //银行名称
        bank_name: "", //开户银行
        card_code: "", //银行卡号
        maxFileCount: 1, //上传图片的最大张数
    },

    onLoad: function () {
        this.initValidate();
    },

    // 点击跳转地图
    goToMap() {
        wx.navigateTo({ url: "/pages/map/map" });
    },

    //图片转换
    onimageShangpuFilesChange(e) {
        this.data.imageShangpu = e.detail;
    },
    onimageDianzhuzhengFilesChange(e) {
        this.data.imageDianzhuzheng = e.detail;
    },
    onimageDianzhufanFilesChange(e) {
        this.data.imageDianzhufan = e.detail;
    },
    onimageYingyezhaoFilesChange(e) {
        this.data.imageYingyezhao = e.detail;
    },

    //校验
    //因为只有以下三个信息在Value中，所以校验时另外的单独校验
    initValidate() {
        const rules = {
            merchant_name: {
                required: true,
            },
            mobile_phone: {
                required: true,
                tel: true,
            },
            name: {
                required: true,
            },
        };

        const message = {
            merchant_name: {
                required: "请填写商铺名称",
            },
            mobile_phone: {
                required: "请输入商铺电话",
                tel: "商铺电话错误",
            },
            name: {
                required: "请填写店主名称",
            },
        };

        //实例化当前的验证规则和提示消息
        this.WxValidate = new WxValidate(rules, message);
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

    //商家入驻提交申请
    formSubmit(e) {
        const value = e.detail.value;

        if (!this.WxValidate.checkForm(value)) {
            //表单元素验证不通过，此处给出相应提示
            let error = this.WxValidate.errorList[0];
            this.showToast(error.msg);
            return;
        }
        if (this.data.address === "") {
            this.showToast("请填写商铺地址");
            return;
        }
        if (this.data.imageShangpu.length === 0) {
            this.showToast("请上传商铺图片");
            return;
        }
        if (this.data.imageDianzhuzheng.length === 0) {
            this.showToast("请上传店主证件照正面");
            return;
        }
        if (this.data.imageDianzhufan.length === 0) {
            this.showToast("请上传店主证件照反面");
            return;
        }
        if (value.card_name === "") {
            this.showToast("请填写卡主姓名");
            return;
        }
        if (value.bank === "") {
            this.showToast("请填写银行名称");
            return;
        }
        if (value.bank_name === "") {
            this.showToast("请填写开户银行");
            return;
        }
        if (value.card_code === "") {
            this.showToast("请填写银行卡号");
            return;
        }

        app.request(
            "/userInfoMerchant.do",
            "ADD",
            {
                merchant_name: value.merchant_name,
                address: this.data.address,
                mobile_phone: value.mobile_phone,
                image: this.data.imageShangpu[0],
                name: value.name,
                business_license: this.data.imageYingyezhao[0],
                card_picture: [
                    this.data.imageDianzhuzheng[0],
                    this.data.imageDianzhufan[0],
                ],
                bank: value.bank,
                bank_name: value.bank_name,
                card_code: value.card_code,
                card_name: value.card_name,
            },
            (data, code) => {
                if (code === 200) {
                    wx.showToast({
                        title: "操作成功",
                        icon: "success",
                        duration: 2000,
                    });
                    this.setData({
                        merchant_name: "",
                        address: "",
                        mobile_phone: "",
                        name: "",
                        imageShangpu: [],
                        imageDianzhuzheng: [],
                        imageDianzhufan: [],
                        imageYingyezhao: [],
                        bank_name: "",
                        bank: "",
                        card_code: "",
                        card_name: "",
                    });
                    wx.switchTab({
                        url: "/pages/index/index",
                    });
                }
            }
        );
    },

    //下拉加载
    onPullDownRefresh: function () {
        this.setData({
            merchant_name: "", //商铺名称
            address: "", //商铺地址
            mobile_phone: "", //商铺电话
            name: "", //店主名称
            imageShangpu: [], //商铺图片
            imageDianzhuzheng: [], //店主证件照正面
            imageDianzhufan: [], //店主证件照反面
            imageYingyezhao: [], //营业执照
            card_name: "", //卡主姓名
            bank: "", //银行名称
            bank_name: "", //开户银行
            card_code: "", //银行卡号
        });
        console.log(this.data.merchant_name);
        setTimeout(function () {
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
});

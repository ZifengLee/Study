import WxValidate from "../../utils/WxValidate.js";
const app = getApp();

Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        merchant_name: "",
        address: "",
        mobile_phone: "",
        name: "",
        maxFileCount: 1,
        imageShangpu: [],
        imageDianzhuzheng: [],
        imageDianzhufan: [],
        imageYingyezhao: [],
        bank: "",
        bank_name: "",
        card_code: "",
        card_name: "",
        item: "", //存放缓存数据
        isCanAddFile: false,
    },

    onLoad: function (options) {
        this.initValidate();
        this.setData({
            item: wx.getStorageSync("item"), //得到缓存数据
        });

        this.setData({
            merchant_name: this.data.item.merchant_name || "",
            address: this.data.item.address || "",
            mobile_phone: this.data.item.mobile_phone || "",
            imageShangpu: this.data.item.image ? [this.data.item.image] : [],
            name: this.data.item.name || "",
            imageYingyezhao: this.data.item.business_license
                ? [this.data.item.business_license]
                : [],
            imageDianzhuzheng: this.data.item.card_picture[0]
                ? [this.data.item.card_picture[0]]
                : [],
            imageDianzhufan: this.data.item.card_picture[1]
                ? [this.data.item.card_picture[1]]
                : [], // [null] || []
            bank: this.data.item.bank || "",
            bank_name: this.data.item.bank_name || "",
            card_code: this.data.item.card_code || "",
            card_name: this.data.item.card_name || "",
            flag: this.data.item.flag || "",
            merchant_id: this.data.item.id || "",
        });
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
    initValidate() {
        //规则
        const rules = {
            merchant_name: {
                required: true,
            },
            address: {
                required: true,
            },
            mobile_phone: {
                required: true,
                tel: true,
                maxlength: 11,
            },
            name: {
                required: true,
            },
        };
        //错误时提示的消息
        const message = {
            merchant_name: {
                required: "请填写商铺名称",
            },
            address: {
                required: "请填写商铺地址",
            },
            mobile_phone: {
                required: "请输入手机号码",
                tel: "手机号码错误",
                maxlength: "手机号码错误",
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
            duration: 2000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
            icon: "warn", //图标，支持"success"、"loading"
        });
    },

    //页面销毁的时候清除缓存
    onHide() {
        wx.removeStorageSync("item");
    },

    // 修改信息提交申请
    formSubmit(e) {
        const value = e.detail.value;
        const data = this.data;
        value.merchant_name = value.merchant_name || data.merchant_name;
        value.address = value.address || data.address;
        value.mobile_phone = value.mobile_phone || data.mobile_phone;
        value.name = value.name || data.name;
        value.bank = value.bank || data.bank;
        value.bank_name = value.bank_name || data.bank_name;
        value.card_code = value.card_code || data.card_code;
        value.card_name = value.card_name || data.card_name;

        // console.log(value);
        if (!this.WxValidate.checkForm(value)) {
            //表单元素验证不通过，此处给出相应提示
            let error = this.WxValidate.errorList[0];
            this.showToast(error.msg);
            return;
        }

        if (this.data.imageShangpu.length === 0) {
            this.showToast("请上传商铺图片");
            return;
        }

        app.request(
            "/userInfoMerchant.do",
            "MODIFY",
            {
                merchant_id: this.data.merchant_id,
                merchant_name: value.merchant_name,
                address: value.address,
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
                    wx.switchTab({
                        url: "/pages/index/index",
                    });
                }
            }
        );
    },
});

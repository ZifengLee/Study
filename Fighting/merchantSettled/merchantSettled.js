import WxValidate from "../../utils/WxValidate.js";
const app = getApp();

Page({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
        hasImage: true, // 未上传图片时不显示
        isHasImage: false, // 当图片数量大于9时不显示上传按钮
        address: "",
        maxFileCount: 1,
        imageShangpu: [],
        imageDianzhuzheng: [],
        imageDianzhufan: [],
        imageYingyezhao: [],
        isAdd: true,
        id: -1,

        merchant_name: "",
        mobile_phone: "",
        name: "",
        business_license: "",
        card_picture: [],
        bank: "",
        bank_name: "",
        card_code: "",
        card_name: "",
        flag: "",
        merchant_id: "",
        item: {}, //上一个页面传输过来的数据
    },
    onShow() {
        this.onLoad()
    },
    onLoad: function (options) {
        this.setData({
            item: wx.getStorageSync("item"),//得到缓存数据
        });
        // 如果是点击店铺信息进入，为页面赋值
        if (this.data.item.id) {
            this.setData({
                merchant_name: this.data.item.merchant_name || "",
                address: this.data.item.address || "",
                mobile_phone: this.data.item.mobile_phone || "",
                imageShangpu: [this.data.item.image] || [],
                name: this.data.item.name || "",
                imageYingyezhao: this.data.item.business_license || [],
                card_picture: this.data.item.card_picture || [],
                bank: this.data.item.bank || "",
                bank_name: this.data.item.bank_name || "",
                card_code: this.data.item.card_code || "",
                card_name: this.data.item.card_name || "",
                flag: this.data.item.flag || "",
                merchant_id: this.data.item.id || "",
                isAdd: false,
            });
        } else {
            this.setData({//将页面内容置空
                merchant_name: "",
                address: "",
                mobile_phone: "",
                imageShangpu: [],
                name: "",
                imageYingyezhao: [],
                card_picture: [],
                bank: "",
                bank_name: "",
                card_code: "",
                card_name: "",
                flag: "",
                merchant_id: "",
            });
        }
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
    initValida() {
        const rules = {
            merchant_name: {
                required: true,
            },
            address: {
                required: true,
            },
            mobile_phone: {
                required: true,
                maxlength: 11,
            },
            name: {
                required: true,
            },
        };

        const message = {
            merchant_name: {
                required: "请填写商铺名称",
                maxlength: "名字不能超过10个字",
            },
            address: {
                required: "请填写商铺地址",
            },
            mobile_phone: {
                required: "请输入手机号码",
                maxlength: "手机号错误",
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
        wx.removeStorageSync('item')
    },

    // 商家入驻提交申请
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

        if (value.merchant_name === "") {
            this.showToast("请填写商铺名称");
            return;
        }
        if (value.address === "") {
            this.showToast("请填写商铺地址");
            return;
        }
        if (value.mobile_phone === "") {
            this.showToast("请填写商铺电话");
            return;
        }
        if (value.name === "") {
            this.showToast("请填写店主名称");
            return;
        }
        if (this.data.imageShangpu.length === 0) {
            this.showToast("请上传商铺图片");
            return;
        }
        
        app.request(
            "/userInfoMerchant.do",
            this.data.isAdd ? "ADD" : "MODIFY",
            {
                id: this.data.id,
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
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    });
                    wx.switchTab({
                        url: "/pages/index/index",
                    });
                }
            }
        );
    },
});

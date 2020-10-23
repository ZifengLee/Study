import WxValidate from "./WxValidate.js";

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.initValidate()
        // new WxValidate();
    },



    //校验
    initValidate() {
        const rules = {
            // a: {
            //     required: true,
            //     email:true,
            // },
            b: {
                required: true,
                tel: true,
            },
            // c:{
            //     minlength: 2,
            //     maxlength: 5,
            // },
            // d:{
            //     rangelength:[2,5],
            //     min: 300,
            // }
        };

        const message = {
            // a: {
            //     required: "true",
            // },
            b: {
                // tel: "bbb",
            }
        };

        //实例化当前的验证规则和提示消息
        const a = new WxValidate(rules, message);

        if (!a.checkForm({
            // a: 1
            b: 166070546931
        })) {
            console.log(a.errorList);
        } else {
            console.log('true');

        }
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
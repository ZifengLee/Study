const app = getApp();

Page({
  data: {
    merchantInfo: {},
    mobile_phone: "",
    userInfo: {
      mobile_phone: "",
      remark: "",
    },
    orderInfo: {},
    actuallyAmount: 0.0,
    showModal: false,
  },
  onLoad: function (options) {
    app.getMerchantInfo((merchant) => {
      this.setData({
        merchantInfo: merchant,
      });
    });

    //拿到订单的数据
    if (app.data.orderInfo) {
      this.setData({
        orderInfo: app.data.orderInfo,
        actuallyAmount: app.data.orderInfo.actuallyAmount,
      });
    }
  },
  changeCustomerInfoMobilePhone(e) {
    this.setData({
      showModal: true,
    });
  },

  changeCustomerMobilePhone(e) {},
  changeRemark(e) {
    this.data.userInfo.remark = e.detail.value;
  },
  bindshowModalSuccess(e) {
    this.data.userInfo.mobile_phone = e.detail;
    this.setData({
      mobile_phone: e.detail,
      showModal: false,
    });
  },
});

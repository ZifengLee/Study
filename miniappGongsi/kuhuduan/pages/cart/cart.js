const app = getApp();
Page({
  data: {
    selectedAllStatus: true,
    toastStr: "",
    total: "",
    carts: [],
    imgBaseUrl: app.data.imgbaseUrl, //图片基础路径
  },
  del(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var carts = this.data.carts;
    carts.splice(index, 1);
    this.sum();
  },
  bindMinus(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var number = this.data.carts[index].number;
    // 如果只有1件了，就不允许再减了
    if (number > 1) {
      number--;
    }
    // 购物车数据
    this.data.carts[index].number = number;

    this.sum();
  },
  bindPlus(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var number = this.data.carts[index].number + 1;
    // 购物车数据
    this.data.carts[index].number = number;

    this.sum();
  },

  bindCheckbox(e) {
    /*绑定点击事件，将checkbox样式改变为选中与非选中*/
    //拿到下标值，以在carts作遍历指示用
    var xuanzhong = true;
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.carts[index].selected;
    var carts = this.data.carts;
    // 对勾选状态取反
    carts[index].selected = !selected;
    for (var i = 0; i < carts.length; i++) {
      if (!carts[i].selected) {
        xuanzhong = false;
      }
    }
    // 写回经点击修改后的数组
    this.setData({
      selectedAllStatus: xuanzhong,
    });
    this.sum();
  },
  bindSelectAll() {
    // 环境中目前已选状态
    var selectedAllStatus = this.data.selectedAllStatus;
    // 取反操作
    selectedAllStatus = !selectedAllStatus;
    // 购物车数据，关键是处理selected值
    var carts = this.data.carts;
    // 遍历
    for (var i = 0; i < carts.length; i++) {
      carts[i].selected = selectedAllStatus;
    }
    this.setData({
      selectedAllStatus: selectedAllStatus,
    });
    this.sum();
  },
  bindCheckout() {
    // 初始化toastStr字符串
    var toastStr = "cid:";
    // 遍历取出已勾选的cid
    for (var i = 0; i < this.data.carts.length; i++) {
      if (this.data.carts[i].selected) {
        toastStr += this.data.carts[i].cid;
        toastStr += " ";
      }
    }

    let carts = wx.getStorageSync("carts") || [];
		const req = carts.filter((it) => it.selected);

		app.request(
      "/customOrderForm.do",
      "SHOPING",
      {commodity:req},
      (data) => {
				if(data.code === 200){
          console.log('提交成功')
          app.data.orderInfo = data.data;
					carts = carts.filter((it) => !it.selected);
					wx.setStorage({key:"carts", data:carts});
					//TODO 显示成功,并跳转订单确认
				} else {
					//TODO 显示失败
				}

      }
    );
  },
  sum() {
    const carts = this.data.carts;
    // 计算总金额
    let total = 0;
    carts.forEach((item) => {
      if (item.selected) {
        total += item.number * item.actual_price;
      }
    });

    // 写回经点击修改后的数组
    this.setData({
      carts: carts,
      total: "￥" + total.toFixed(2),
    });
    wx.setStorage({key:"carts", data:carts});
  },

  onLoad() {
    app.data.orderInfo = {};
    this.getGwc();
    this.sum();
  },
  //获取数据
  getGwc() {
    this.data.carts = wx.getStorageSync("carts");
  },
});

Page({
  data: {
    addressList: [{ "name": "111", },
    { "name": "222", },
    { "name": "333", }],
    editIndex: 0,
    delBtnWidth: 200,//删除按钮宽度单位（rpx）
    startX: "",//触摸起始位置的X坐标
    showDel: false,
  },

  touchstart: function (e) {
    // console.log(e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },

  touchmove: function (e) {
    // console.log(e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      // console.log(delBtnWidth);

      var txtStyle = "";
      // if(disX == 0 || disX < 0){//如果移动距离小于等于0，文本层位置不变
      //   // txtStyle = "left:0rpx";
      // }else if(disX > 0 ){//移动距离大于0，文本层left值等于手指移动距离
      //   txtStyle = "left:-"+disX+"rpx";
      //   if(disX>=delBtnWidth){
      //     //控制手指移动距离最大值为删除按钮的宽度
      //     txtStyle = "left:-"+delBtnWidth+"rpx";
      //   }
      // }
      if (that.data.showDel) {
        if (disX < 0) {
          txtStyle = "left:-" + (delBtnWidth + disX) + "rpx";
          if (-disX >= delBtnWidth) {
            txtStyle = "left:0rpx"
          }
        } else {
          return
        }
      } else {
        if (disX > 0) {
          txtStyle = "left:-" + disX + "rpx";
          if (disX >= delBtnWidth) {
            txtStyle = 'left:-' + delBtnWidth + 'rpx'
          }
        } else {
          return
        }
      }

      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.addressList;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        addressList: list
      });
    }
  },

  touchend: function (e) {
    console.log("touchend" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      // var txtStyle = disX > delBtnWidth/2 ? 'left:-'+delBtnWidth +'rpx' :"left:0rpx";

      var txtStyle;
      if (that.data.showDel) {
        if (-disX > delBtnWidth / 2) {
          txtStyle = 'left:0'
          that.data.showDel = false
        } else {
          txtStyle = 'left:-' + delBtnWidth + 'rpx'
        }
      } else {
        if (disX > delBtnWidth / 2) {
          txtStyle = 'left:-' + delBtnWidth + 'rpx'
          that.data.showDel = true
        } else {
          txtStyle = 'left:0'
        }
      }



      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.addressList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        addressList: list
      });
    }
  },
})
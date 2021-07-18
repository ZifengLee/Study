Page({
    data: {
      heightArr: [],
      distance: 0,
      active: 0,
      selectId: "item0",
      navList: ['语文', '数学', '英语', '历史', '体育', '音乐']
    },

    onLoad: function (options) {
      this.selectHeight();
    },

    // 选择左侧标签锚点定位
    activeNav(e) {
      var index = e.currentTarget.dataset.index
      this.setData({
        active: index,
        selectId: "item" + index
      })
    },

    //计算右侧每个锚点的高度
    selectHeight() {
      var list = []
      var height = 0;
      const query = wx.createSelectorQuery();
      query.selectAll('.subtitle').boundingClientRect()
      query.exec((res) => {
        res[0].forEach((item) => {
          height += item.height;
          list.push(height)
        })
        this.data.heightArr = list
      })
    },

    //监听scroll-view的滚动事件
    watchScroll(e) {
      let scrollTop = e.detail.scrollTop; //获取距离顶部的距离
      let active = this.data.active;
      if (scrollTop >= this.data.distance) {
        if (active + 1 < this.data.heightArr.length && scrollTop >= this.data.heightArr[active]) {
          this.setData({
            active: active + 1
          })
        }
      } else {
        if (active - 1 >= 0 && scrollTop < this.data.heightArr[active - 1]) {
          this.setData({
            active: active - 1
          })
        }
      }
      this.data.distance = scrollTop;
    }
  })
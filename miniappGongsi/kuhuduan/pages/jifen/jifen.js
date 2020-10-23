// pages/jifen/jifen.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_number:1,
    page_count:10,
    zongfen:'',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getJifen();
  },
  getJifen() {
    app.request(
      '/customAccount.do',
      'LIST',
      {
        page_number:this.data.page_number,
        page_count:this.data.page_count
      },
      (data,code) => {
        console.log(data);
        this.setData({
          zongfen:data.data.integral,
          list:data.data.list
        })
      }
    )
  }
})
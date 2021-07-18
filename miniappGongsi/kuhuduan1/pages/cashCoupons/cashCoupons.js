const app = getApp()

Page({
  data: {
    page_number:1,
    page_count:10,
    allMoney:'',
    list:[]
  },

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
          allMoney:data.data.money,
          list:data.data.list
        })
      }
    )
  }
})
var common = require("../../utils/upload.js");
const app = getApp();
Component({
  lifetimes: {
    // attached: function () {
    //   this.setData({
    //     isCanAddFile: this.data.maxFileCount > this.data.files.length,
    //   });
    // },
  },
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    files: {
      type: Array,
      value: [],
    },
    wxFiles: {
      type: Array,
      value: [],
    },
    maxFileCount: {
      //允许最多9张图片
      type: Number,
      value: 1,
    },
    isCanAddFile:{
      type:Boolean,
      value:true,
    }
  },
  data: {
    // isCanAddFile: true,
    imgbaseUrl: app.data.imgbaseUrl, // 基础img
  },
  methods: {
    /*图片上传 */
    _chooseImage: function (e) {
      console.log(this.data.isCanAddFile)
      var that = this;
      wx.chooseImage({
        count: that.data.maxFileCount - that.data.files.length,
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var waitFiles = res.tempFilePaths;
          // console.log(waitFiles)
          var allowCount =
            that.data.maxFileCount - that.data.files.length; //允许上传的文件数
          if (waitFiles.length >= allowCount) {
            waitFiles = waitFiles.slice(0, allowCount);
          }
          var wxFiles = that.data.wxFiles;
          waitFiles.map(function (value, index) {
            wxFiles.push(value);
          });
          var index = 0; //第几张开始
          var successFiles = []; //成功的文件
          common.uploadFiles(
            waitFiles,
            index,
            successFiles,
            function (urls) {
              //此处为抽出的公用方法，便于其它地方调用
              that.data.files = that.data.files.concat(urls);

              that.setData({
                files: that.data.files,
                isCanAddFile:
                  that.data.files.length <
                  that.data.maxFileCount,
              });

              that.triggerEvent("files", that.data.files);
            }
          );
        },
      });
    },
    /*图片预览*/
    _previewImage: function (e) {
      //获取当前图片的下标
      var index = e.currentTarget.dataset.index;
      //所有图片
      var imgs = this.data.wxFiles;
      wx.previewImage({
        //当前显示图片
        current: imgs[index],
        //所有图片
        urls: imgs,
      });
      // var preUlrs = [];
      // this.data.wxFiles.map(
      //   function (value, index) {
      //     preUlrs.push(value);
      //     console.log(preUlrs)
      //   }
      // );
      // wx.previewImage({
      //   current: e.currentTarget.index, // 当前显示图片的http链接
      //   urls: preUlrs // 需要预览的图片http链接列表
      // })
    },
    /*图片删除*/
    deleteImg: function (e) {
      var that = this;
      var files = that.data.files;
      var wxFiles = that.data.wxFiles;
      var index = e.currentTarget.dataset.index; //获取当前长按图片下标
      wx.showModal({
        title: "提示",
        content: "确定要删除此图片吗？",
        success: function (res) {
          if (res.confirm) {
            files.splice(index, 1);
            wxFiles.splice(index, 1);
          } else if (res.cancel) {
            return false;
          }
          that.setData({
            files,
            wxFiles,
            isCanAddFile: true,
          });
          that.triggerEvent("files", that.data.files);
        },
      });
    },
    /*************供外部调用接口*******************/
    getFiles: function () {
      return this.data.files;
      //return this.data.wxFiles
    },
  },
});

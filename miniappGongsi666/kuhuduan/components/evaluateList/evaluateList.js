// 获取应用实例
const app = getApp();

Component({
    data: {
        imgbaseUrl: app.data.imgbaseUrl, // 图片基本路径
    },
    properties: {
        itemData: Array,
        images: Array
    },
    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function() {},
        hide: function() {},
        resize: function() {},
    },
})
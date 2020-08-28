new Vue({
    el: "#app",
    data: {
        message: "我爱我家！",
        isActive: true,
        hasError: true,
        name: "Vue.js",
    },
    // 在 `methods` 对象中定义方法
    methods: {
        greet: function (event) {
            // `this` 在方法里指当前 Vue 实例
            alert("Hello " + this.name + "!");
            // `event` 是原生 DOM 事件
        },
    },
});
app.greet(); // -> 'Hello Vue.js!'

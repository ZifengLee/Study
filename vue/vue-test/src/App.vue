<template>
    <div id="app">
        <nav v-on:click.prevent>
            <router-link id="test1" to="/" exact-active-class="active"
                >首页</router-link
            >
            <router-link id="test3" to="/test3" exact-active-class="active"
                >默认棋盘</router-link
            >
            <router-link id="test2" to="/test2" exact-active-class="active"
                >自定义棋盘</router-link
            >
        </nav>
        <!-- 路由出口 -->
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view />
    </div>
</template>

<script>
export default {
    name: "App",
    data() {
        return {};
    },
    methods: {}
};
</script>

<!-- 样式代码 -->
<style lang="scss" scoped>
body {
    color: #5e5b64;
    text-align: center;
}

#app {
    max-width: 480px;
    font-size: 16px;
}

nav {
    display: flex;
    justify-content: space-around;
    background-color: #00a2ff;
    border-radius: 2px;
    margin-bottom: 10px;
}
a {
    display: inline-block;
    padding: 10px 0px;
    text-decoration: none;
    color: black;
}
.active {
    color: #fff;
}
</style>

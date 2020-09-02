<template>
    <div id="app">
        <nav v-on:click.prevent>
            <router-link id="test1" to="/" exact-active-class="active">TEST1</router-link>
            <router-link id="test2" to="/test2" exact-active-class="active">TEST2</router-link>
            <router-link id="test3" to="/test3" exact-active-class="active">TEST3</router-link>
            <router-link id="page3" to="/page3" exact-active-class="active">PAGE3</router-link>
            <router-link to="/test" exact-active-class="active">TEST</router-link>
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

nav {
    // display: inline-block;
    display: flex;
    justify-content: center;
    margin: 30px auto;
    background-color: #00a2ff;
    border-radius: 2px;
    width: 50%;
}
a {
    display: inline-block;
    padding: 18px 30px;
    text-decoration: none;
    color: black;
}
.active {
    color: #fff;
}
</style>

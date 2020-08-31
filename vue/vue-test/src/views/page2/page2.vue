<template>
  <div>当前页面：{{ pagename }}</div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      pagename: "PAGE2"
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
div {
  margin: 0px auto;
  text-align: center;
}
</style>

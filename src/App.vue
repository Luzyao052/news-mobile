<template>
  <div id="app">
    <!--路由占位符-->
    <keep-alive :include="$store.state.cachePage">
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      cachePage: ['layOut']
    }
  }
}
</script>

<style lang="less" scoped>
</style>

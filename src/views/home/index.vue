<template>
  <!-- <button @click="callParentMethod">调用App方法</button> -->
  <div></div>
</template>
<style>

</style>
<!-- HomeIndex.vue -->
<script>
export default {
  name: 'HomeIndex',
  inject: ['playerMethods'], // 注入方法
  mounted() { // 组件挂载后自动执行
    console.log('adfdfa');
    // this.callParentMethod('abcabc')
  },
  methods: {
    callParentMethod(message) {
      if (this.playerMethods?.sendMessage) {
        this.playerMethods.sendMessage(message);
      } else {
        console.error('方法未成功注入');
      }
    }
  },
}

</script>



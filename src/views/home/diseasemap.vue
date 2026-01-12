<template>
  <div></div>

</template>
<style></style>
<script>
export default {
  name: 'HomeDieasemap', // 改为多单词名称
  inject: ['playerMethods'], // 注入方法
  mounted() { // 组件挂载后自动执行
    console.log('adfdfa');
    // this.callParentMethod('病害热力图')
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
<template>
  <div class="vertical-slider-container">
    <div class="slider-track" ref="trackRef" @click="handleTrackClick">
      <!-- 分段刻度线 -->
      <div 
        v-for="i in 5" 
        :key="i" 
        class="tick-mark" 
        :style="{ bottom: `${(i - 1) * 20}%` }"
      ></div>
      
      <!-- 进度条 -->
      <div class="slider-progress" :style="{ height: progressHeight }"></div>
    </div>
    
    <!-- 滑块 -->
    <!-- <div 
      class="slider-thumb" 
      :style="{ bottom: thumbPosition }" 
      @mousedown="startDrag"
      @touchstart="startDrag"
    ></div> -->

    <div 
      class="slider-thumb" 
      :style="{ bottom: thumbPosition }" 
      @mousedown="startDrag"
      @touchstart="startDrag"
    ></div>
    
    <!-- 显示当前值 -->
    <!-- <div class="slider-value">{{ currentValue }}%</div> -->
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount,inject } from 'vue'

const currentValue = ref(20) // 默认值
const trackRef = ref(null)
const isDragging = ref(false)

// 计算进度条高度
const progressHeight = computed(() => `${currentValue.value}%`)

// 计算滑块位置
const thumbPosition = computed(() => `${currentValue.value - 3}%`)

// 将值吸附到最近的20%刻度
const snapToNearest = (value) => {
  return Math.round(value / 20) * 20
}

// 开始拖动
const startDrag = (e) => {
  e.preventDefault()
  isDragging.value = true
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('touchmove', handleDrag, { passive: false })
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

// 处理拖动
const handleDrag = (e) => {
  if (!isDragging.value || !trackRef.value) return
  
  const track = trackRef.value
  const rect = track.getBoundingClientRect()
  
  // 获取当前鼠标/触摸位置
  const clientY = e.clientY || (e.touches && e.touches[0].clientY)
  if (!clientY) return
  
  // 计算相对于轨道的位置
  let position = rect.bottom - clientY
  position = Math.max(0, Math.min(position, rect.height))
  
  // 计算百分比值
  let percentage = Math.round((position / rect.height) * 100)
  // 吸附到最近的20%刻度
  currentValue.value = snapToNearest(percentage)
}

// 点击轨道调整
const handleTrackClick = (e) => {
  if (isDragging.value) return
  
  const track = trackRef.value
  if (!track) return
  
  const rect = track.getBoundingClientRect()
  const position = rect.bottom - e.clientY
  let percentage = Math.round((position / rect.height) * 100)
  // 吸附到最近的20%刻度
  currentValue.value = snapToNearest(percentage)

  ue5click(Math.round(currentValue.value / 20) * 20);
}

// 停止拖动
const stopDrag = () => {

  ue5click(Math.round(currentValue.value / 20) * 20);
  isDragging.value = false
  removeEventListeners()
}

// 清理事件监听
const removeEventListeners = () => {
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 组件卸载时清理
onBeforeUnmount(removeEventListeners)
/* 触发ue5 */
// 注入父组件提供的方法
const playerMethods = inject('playerMethods')
// 封装调用逻辑
const callParentMethod = (message) => {
  if (playerMethods?.sendMessage) {
    playerMethods.sendMessage(message)
  } else {
    console.error('方法未成功注入')
  }
}
const ue5click = (index) => {
  console.log('点击触发', {"code": 1, "type": "slider", "data": {"id": index}});
  callParentMethod({"code": 1, "type": "slider", "data": {"id": index}});
}
/* 触发ue5 */

</script>

<style scoped>
.vertical-slider-container {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  height: 200px;
  padding: 0px 10px 0px;
  user-select: none;
  margin-bottom: 20px;
}

.slider-track {
  position: relative;
  width: 2px;
  height: 100%;
  background: #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}

.slider-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #4dc1c6;
  transition: height 0.2s;
}

.slider-thumb {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  border: 3px solid #4dc1c6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 10;
  transition: bottom 0.2s;
}

.tick-mark {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 2;
}

.slider-value {
  margin-top: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #4dc1c6;
}
</style>
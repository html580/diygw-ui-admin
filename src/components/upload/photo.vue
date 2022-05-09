<template>
  <div style="line-height: 0;">
     <div
        v-if="imageSrc"
        tabindex="0"
        style="margin-bottom: 8px;"
        :style="`width:${width}px; height:${height}px;`"
        class="el-upload thumbnail el-upload--picture-card"
        @click="upload"
        >
        <div class="file-image" :style="{ backgroundImage: 'url(' + imageSrc + ')' }"></div>
    </div>
    <div
        v-if="!imageSrc"
        tabindex="0"
        style="margin-bottom: 8px;"
        :style="`width:${width}px; height:${height}px;`"
        class="el-upload thumbnail el-upload--picture-card"
        @click="upload"
        >
        <i class="el-icon-plus" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'photo',
  props: {
    // 外部v-model值
    value: {
      type: String
    },
    width: {
      default: 140
    },
    height: {
      default: 140
    },
    isMove: {
      default: true
    }
  },
  emits: ['update:value','upload'],
  setup(props, { emit }) {
    const imageSrc = useVModel(props, 'value', emit)
    const upload = ()=>{
        emit('upload')
    }
      
    return {
      upload,
      imageSrc
    }
  }
})
</script>

<style lang="scss" scoped>
  .thumbnail {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width:80px;height:80px;
  }
  .file-image{
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 4px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 50% 50%;
    }
   
</style>

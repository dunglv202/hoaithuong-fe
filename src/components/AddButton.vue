<template>
  <el-button class="add-btn" type="primary" @click="handleClick" :icon="IconNews">Add</el-button>
</template>

<style scoped>
.add-btn {
  margin-left: 0;
}
</style>

<script lang="ts" setup>
import { IconNews } from '@tabler/icons-vue'

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

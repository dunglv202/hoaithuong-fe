<template>
  <el-button class="back-btn" @click="goBack">
    <el-icon>
      <IconChevronLeft />
    </el-icon>
  </el-button>
</template>

<style scoped>
.back-btn {
  border: none;
}

.back-btn:hover {
  background: transparent;
}
</style>

<script lang="ts" setup>
import { IconChevronLeft } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push('..')
  }
}
</script>

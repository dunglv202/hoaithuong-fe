<template>
  <RouterView />
  <div class="floating-actions">
    <el-tooltip class="box-item" content="Change apprearance" placement="left" effect="light">
      <el-button
        :icon="themeStore.theme == 'dark' ? IconSun : IconMoon"
        circle
        @click="themeStore.toggleTheme"
      />
    </el-tooltip>
    <el-tooltip class="box-item" content="Send feedback" placement="left" effect="light">
      <el-button :icon="IconMail" circle />
    </el-tooltip>
  </div>
</template>

<style scoped>
.floating-actions {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
}
.floating-actions .el-button {
  margin: 0;
  font-size: 1.25rem;
}
</style>

<script setup lang="ts">
import { IconMail, IconMoon, IconSun } from '@tabler/icons-vue'
import useThemeStore from './stores/theme'

const themeStore = useThemeStore()
</script>

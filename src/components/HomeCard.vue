<template>
  <RouterLink class="ctn" @click="$emit('click')" :to="to">
    <el-card class="card">
      <div class="wrapper">
        <el-icon size="1.25rem">
          <slot name="icon"></slot>
        </el-icon>
        <el-text class="label" v-if="$slots.label">
          <slot name="label"></slot>
        </el-text>
      </div>
    </el-card>
  </RouterLink>
</template>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card,
.label {
  color: inherit;
  box-shadow: none;
}

.ctn {
  padding: 0;
  color: initial;
}

.ctn:hover {
  color: var(--el-color-primary);
}

.ctn:hover .card {
  border-color: var(--el-color-primary-light-5);
}
</style>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'

const { to } = defineProps<{
  to: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

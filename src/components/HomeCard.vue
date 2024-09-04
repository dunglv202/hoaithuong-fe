<template>
  <RouterLink class="ctn" @click="$emit('click')" :to="to">
    <el-card class="card">
      <div class="wrapper">
        <el-icon class="icon">
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
  color: var(--el-text-color-primary);
  box-shadow: none;
  user-select: none;
}

.ctn {
  padding: 0;
  color: initial;
}

.ctn:hover {
  color: var(--el-color-primary);
}

.ctn:hover .card {
  border-color: var(--el-color-primary-light-7);
}

.ctn:hover .label,
.ctn:hover .icon {
  color: var(--el-color-primary);
}

.icon {
  font-size: 1.3rem;
}

@media screen and (max-width: 768px) {
  .wrapper {
    padding-top: 5px;
    flex-direction: column;
    gap: 20px;
  }
  .icon {
    color: var(--el-color-primary);
    font-size: 1.5rem;
  }
  .card {
    border: none;
  }
  .label {
    color: var(--el-text-color-regular);
  }
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

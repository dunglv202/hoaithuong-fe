<template>
  <div class="toolbar">
    <slot></slot>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>

<script lang="ts" setup></script>

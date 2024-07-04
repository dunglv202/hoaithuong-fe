<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import { onMounted, ref, watch } from 'vue'

const title = ref()

onMounted(() => {
  if (title.value instanceof HTMLHeadingElement) {
    title.value.innerText = 'Hello Vue 3!'
  }
})

watch(title, (newTitle, oldTitle) => {
  console.log('Title changed from', oldTitle, 'to', newTitle)
})
</script>

<template>
  <h2 ref="title">Hello World!</h2>
  <AppHeader title="Test test test" />
</template>

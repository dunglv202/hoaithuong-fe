<template>
  <el-pagination
    class="pagination"
    size="default"
    background
    layout="prev, pager, next"
    :page-count="totalPages"
    :current-page="currentPage"
    hide-on-single-page
    @current-change="(page: number) => $emit('pageChange', page)"
  />
</template>

<style scoped>
.pagination {
  margin-top: 1rem;
}
</style>

<script lang="ts" setup>
defineProps<{
  totalPages: number
  currentPage: number
}>()
defineEmits<{
  pageChange: [page: number]
}>()
</script>

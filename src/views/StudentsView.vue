<template>
  <AppToolbar>
    <BackButton />
    <AddButton @click="addStudentDialog = true" />
    <el-input v-model="search" style="width: 200px" placeholder="Search..." />
  </AppToolbar>
  <el-table :data="students" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="name" label="Name" width="500" />
    <el-table-column prop="notes" label="Notes" />
  </el-table>
  <AppPagination
    v-show="!loading"
    :totalPages="totalPages"
    :currentPage="currentPage"
    @pageChange="(page) => (currentPage = page)"
  />

  <NewStudentDialog v-model="addStudentDialog" @save="loadStudents()" />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
</style>

<script lang="ts" setup>
import AddButton from '@/components/AddButton.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppToolbar from '@/components/AppToolbar.vue'
import BackButton from '@/components/BackButton.vue'
import NewStudentDialog from '@/components/NewStudentDialog.vue'
import type { Student } from '@/models/student'
import { fetchStudents } from '@/services/student-service'
import { onMounted, ref, watch } from 'vue'

const students = ref<Student[]>([])
const addStudentDialog = ref(false)
const search = ref('')
const loading = ref(true)
const totalPages = ref(0)
const currentPage = ref(1)

const loadStudents = async (keyword?: string) => {
  try {
    loading.value = true
    const fetchResult = await fetchStudents(keyword, { page: currentPage.value })
    students.value = fetchResult.content
    totalPages.value = fetchResult.totalPages
  } finally {
    loading.value = false
  }
}

watch(search, (val, _, onCleanup) => {
  const timer = setTimeout(() => loadStudents(val), 300)
  onCleanup(() => clearTimeout(timer))
})

watch(currentPage, () => loadStudents(search.value))

onMounted(() => loadStudents())
</script>

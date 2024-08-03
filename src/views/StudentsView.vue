<template>
  <AppToolbar>
    <BackButton />
    <AddButton @click="addStudentDialog = true" />
  </AppToolbar>
  <el-table :data="students" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="name" label="Name" width="500" />
    <el-table-column prop="notes" label="Notes" />
  </el-table>

  <NewStudentDialog v-model="addStudentDialog" @save="reloadStudents" />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
</style>

<script lang="ts" setup>
import AddButton from '@/components/AddButton.vue'
import AppToolbar from '@/components/AppToolbar.vue'
import BackButton from '@/components/BackButton.vue'
import NewStudentDialog from '@/components/NewStudentDialog.vue'
import type { Student } from '@/models/student'
import { fetchStudents } from '@/services/student-service'
import { onMounted, ref } from 'vue'

const students = ref<Student[]>([])
const addStudentDialog = ref(false)
const loading = ref(false)

const reloadStudents = async () => {
  try {
    loading.value = true
    students.value = await fetchStudents('')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  reloadStudents()
})
</script>

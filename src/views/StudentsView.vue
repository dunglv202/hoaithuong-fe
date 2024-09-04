<template>
  <AppToolbar>
    <BackButton />
    <AddButton @click="openNewPopup()" />
    <el-input
      v-model="search"
      class="search-box"
      placeholder="Search..."
      :prefix-icon="IconSearch"
    />
  </AppToolbar>
  <el-table :data="students" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="reportTo.name" label="Report To" />
    <el-table-column prop="active" label="Status" :align="'center'">
      <template #default="scope">
        <el-tag :class="scope.row.active ? 'active' : 'inactive'">
          {{ scope.row.active ? 'Active' : 'Inactive' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="notes" label="Notes" />
    <el-table-column label="Action" :align="'center'" width="150">
      <template #default="scope">
        <el-button size="default" :icon="IconPencilMinus" @click="openEditPopup(scope.row)" />
      </template>
    </el-table-column>
  </el-table>
  <AppPagination
    v-show="!loading"
    :totalPages="totalPages"
    :currentPage="currentPage"
    @pageChange="(page) => (currentPage = page)"
  />

  <StudentDialog
    v-if="addStudentDialog.visible"
    v-model="addStudentDialog"
    @save="loadStudents()"
  />
</template>

<style scoped>
.toolbar {
  margin-top: 2rem;
  margin-bottom: 3rem;
}

@media screen and (min-width: 768px) {
  .search-box {
    max-width: 220px;
  }
}

.inactive {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
  border-color: var(--el-color-danger-light-7);
}
</style>

<script lang="ts" setup>
import AddButton from '@/components/AddButton.vue'
import AppPagination from '@/components/AppPagination.vue'
import AppToolbar from '@/components/AppToolbar.vue'
import BackButton from '@/components/BackButton.vue'
import StudentDialog, { type StudentDialogModel } from '@/components/StudentDialog.vue'
import type { Student } from '@/models/student'
import { fetchStudents } from '@/services/student-service'
import { IconPencilMinus, IconSearch } from '@tabler/icons-vue'
import { onMounted, ref, watch } from 'vue'

const students = ref<Student[]>([])
const addStudentDialog = ref<StudentDialogModel>({
  visible: false
})
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

const openNewPopup = () => {
  addStudentDialog.value = { visible: true, student: undefined }
}

const openEditPopup = (student: Student) => {
  addStudentDialog.value = {
    visible: true,
    student: {
      ...student,
      reportTo: { ...student.reportTo }
    }
  }
}

watch(search, (val, _, onCleanup) => {
  const timer = setTimeout(() => loadStudents(val), 300)
  onCleanup(() => clearTimeout(timer))
})

watch(currentPage, () => loadStudents(search.value))

onMounted(() => loadStudents())
</script>

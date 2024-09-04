<template>
  <AppToolbar>
    <BackButton />
    <AddButton @click="addStudentDialog = true" />
    <el-input
      v-model="search"
      class="search-box"
      placeholder="Search..."
      :prefix-icon="IconSearch"
    />
  </AppToolbar>
  <el-table :data="students" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="name" label="Name" width="220" />
    <el-table-column prop="active" label="Status" :align="'center'">
      <template #default="scope">
        <el-tag :class="scope.row.active ? 'active' : 'inactive'">
          {{ scope.row.active ? 'Active' : 'Inactive' }}
        </el-tag>
      </template>
    </el-table-column>
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
import NewStudentDialog from '@/components/NewStudentDialog.vue'
import type { Student } from '@/models/student'
import { fetchStudents } from '@/services/student-service'
import { IconSearch } from '@tabler/icons-vue'
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

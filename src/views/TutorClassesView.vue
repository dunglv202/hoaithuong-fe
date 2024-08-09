<template>
  <AppToolbar>
    <BackButton />
    <AddButton @click="openNewPopup" />
    <el-input v-model="search" class="search-box" placeholder="Search..." :prefix-icon="IconSearch" />
  </AppToolbar>
  <el-table :data="classes" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="code" label="Code" width="100" />
    <el-table-column prop="student" label="Student" width="220">
      <template #default="scope">
        <RouterLink :to="'/students/' + scope.row.id">
          {{ scope.row.student.name }}
        </RouterLink>
      </template>
    </el-table-column>
    <el-table-column prop="level" label="Level" width="200" />
    <el-table-column prop="learned" label="Learned" width="100" :align="'right'">
      <template #default="scope"> {{ scope.row.learned }}/{{ scope.row.totalLecture }} </template>
    </el-table-column>
    <el-table-column prop="active" label="Status" :align="'center'">
      <template #default="scope">
        <el-tag :class="scope.row.active ? 'active' : 'inactive'">
          {{ scope.row.active ? 'Active' : 'Ended' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="notes" label="Notes"></el-table-column>
    <el-table-column label="Action" :align="'center'" width="150">
      <template #default="scope">
        <el-button size="default" :icon="IconPencilMinus" @click="openEditPopup(scope.row.id)" />
        <el-button size="default" :icon="IconCopy" @click="openPopupWithDuplication(scope.row.id)" />
      </template>
    </el-table-column>
  </el-table>
  <AppPagination v-show="!loading" :totalPages="totalPages" :currentPage="currentPage"
    @pageChange="(page) => (currentPage = page)" />
  <TutorClassDialog v-model="addClassDialog" :id="selectedClassId"
    @save="selectedClassId ? loadClasses(search) : loadClasses()" :clone="clone" />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
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
import TutorClassDialog from '@/components/TutorClassDialog.vue'
import { type TutorClass } from '@/models/tutor-class'
import { fetchTutorClasses } from '@/services/tutor-class-service'
import { IconCopy, IconPencilMinus, IconSearch } from '@tabler/icons-vue'
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const addClassDialog = ref(false)
const selectedClassId = ref<number>()
const clone = ref(false)
const classes = ref<TutorClass[]>([])
const loading = ref(true)
const search = ref('')
const currentPage = ref(1)
const totalPages = ref(0)

const loadClasses = async (keyword?: string) => {
  try {
    loading.value = true
    const fetchResult = await fetchTutorClasses({ keyword: keyword }, { page: currentPage.value })
    classes.value = fetchResult.content
    totalPages.value = fetchResult.totalPages
  } finally {
    loading.value = false
  }
}

const openNewPopup = () => {
  clone.value = false
  selectedClassId.value = undefined
  addClassDialog.value = true
}

const openEditPopup = (id: number) => {
  clone.value = false
  selectedClassId.value = id
  addClassDialog.value = true
}

const openPopupWithDuplication = (id: number) => {
  clone.value = true
  selectedClassId.value = id
  addClassDialog.value = true
}

watch(addClassDialog, (show) => {
  if (!show) {
    selectedClassId.value = undefined
  }
})

watch(search, (value, _, onCleanup) => {
  const searchTimer = setTimeout(() => loadClasses(value), 400)
  onCleanup(() => clearTimeout(searchTimer))
})

watch(currentPage, () => {
  loadClasses(search.value)
})

onMounted(() => {
  loadClasses()
})
</script>

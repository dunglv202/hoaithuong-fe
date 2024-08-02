<template>
  <div class="toolbar">
    <BackButton />
    <el-button type="primary" @click="openNewPopup" :icon="IconNews">Add</el-button>
  </div>
  <el-table :data="classes" style="width: 100%">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="code" label="Code" width="150" />
    <el-table-column prop="student" label="Student" width="300">
      <template #default="scope">
        <RouterLink :to="'/students/' + scope.row.id">
          {{ scope.row.student.name }}
        </RouterLink>
      </template>
    </el-table-column>
    <el-table-column prop="level" label="Level" width="230" />
    <el-table-column prop="learned" label="Learned" width="100" :align="'right'">
      <template #default="scope"> {{ scope.row.learned }}/{{ scope.row.totalLecture }} </template>
    </el-table-column>
    <el-table-column prop="active" label="Status" :align="'center'">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? 'Active' : 'Ended' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="notes" label="Notes"></el-table-column>
    <el-table-column label="Action">
      <template #default="scope">
        <el-button size="default" :icon="IconPencilMinus" @click="openEditPopup(scope.row.id)" />
      </template>
    </el-table-column>
  </el-table>

  <NewTutorClassDialog v-model="addClassDialog" :id="selectedClassId" @save="loadClasses" />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
</style>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import NewTutorClassDialog from '@/components/NewTutorClassDialog.vue'
import { type TutorClass } from '@/models/tutor-class'
import { fetchTutorClasses } from '@/services/tutor-class-service'
import { IconNews, IconPencilMinus } from '@tabler/icons-vue'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const addClassDialog = ref(false)
const selectedClassId = ref<number>()
const classes = ref<TutorClass[]>([])

const loadClasses = async () => {
  classes.value = await fetchTutorClasses()
}

const openNewPopup = () => {
  selectedClassId.value = undefined
  addClassDialog.value = true
}

const openEditPopup = (id: number) => {
  selectedClassId.value = id
  addClassDialog.value = true
}

onMounted(() => {
  loadClasses()
})
</script>

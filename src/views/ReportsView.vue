<template>
  <div class="toolbar">
    <BackButton />
    <div class="align-right">
      <el-date-picker v-model="reportMonth" type="month" placeholder="Pick a month" />
      <el-button type="primary" @click="downloadReport" v-loading="exporting" :icon="IconCloudDownload">
        Export
      </el-button>
    </div>
  </div>

  <div class="report">
    <el-card class="card">
      <span class="figure"> Total: {{ new Intl.NumberFormat().format(report.totalEarned) }} </span>
    </el-card>
  </div>

  <el-table :data="lectures" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="classCode" label="Code" width="125" />
    <el-table-column prop="date" label="Date" width="125">
      <template #default="scope">
        {{ new Intl.DateTimeFormat('en-US').format(new Date(scope.row.startTime)) }}
      </template>
    </el-table-column>
    <el-table-column prop="time" label="Time" width="150">
      <template #default="scope">
        {{
          new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hour12: false }).format(
            new Date(scope.row.startTime)
          )
        }}
        -
        {{
          new Intl.DateTimeFormat('en-US', { timeStyle: 'short', hour12: false }).format(
            new Date(scope.row.endTime)
          )
        }}
      </template>
    </el-table-column>
    <el-table-column prop="student" label="Student" width="300" :filters="students" :filter-method="filterStudent">
      <template #default="scope">
        <RouterLink :to="'/students/' + scope.row.student.id">
          {{ scope.row.student.name }}
        </RouterLink>
      </template>
    </el-table-column>
    <el-table-column prop="topic" label="Topic" width="300" />
    <el-table-column prop="lecture" label="Lecture" :align="'right'">
      <template #default="scope"> {{ scope.row.lectureNo }}/{{ scope.row.totalLecture }} </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.align-right {
  display: flex;
  gap: 1rem;
}

.report {
  display: flex;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.card {
  box-shadow: none;
}

.report .figure {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import type { Lecture } from '@/models/lecture'
import type { Report, ReportRange } from '@/models/report'
import { getLectures } from '@/services/lecture-service'
import { exportXlsx, getReport } from '@/services/report-service'
import { IconCloudDownload } from '@tabler/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'

const reportMonth = ref(new Date())
const exporting = ref(false)
const lectures = ref<Lecture[]>([])
const range = computed<ReportRange>(() => ({
  year: reportMonth.value.getFullYear(),
  month: reportMonth.value.getMonth() + 1
}))
const students = computed(() => {
  const options = lectures.value.map((l) => ({
    text: `${l.classCode} - ${l.student.name}`,
    value: l.classCode
  }))
  const distinct = new Map(options.map((o) => [o.value, o])).values()
  return Array.from(distinct)
})
const report = ref<Report>({ totalEarned: 0 })
const loading = ref(false)

const filterStudent = (value: string, row: Lecture) => row.classCode === value

const downloadReport = async () => {
  exporting.value = true
  try {
    await exportXlsx(range.value)
  } finally {
    exporting.value = false
  }
}

const refreshReport = async () => {
  try {
    loading.value = true
    lectures.value = await getLectures(range.value)
    report.value = await getReport(range.value)
  } finally {
    loading.value = false
  }
}

onMounted(refreshReport)

watch(range, refreshReport)
</script>

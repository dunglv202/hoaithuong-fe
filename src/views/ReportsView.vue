<template>
  <AppToolbar>
    <BackButton />
    <div class="align-right">
      <el-date-picker v-model="reportMonth" type="month" placeholder="Pick a month" />
      <el-button
        type="primary"
        @click="downloadReport"
        v-loading="exporting"
        :icon="IconCloudDownload"
      >
        Export
      </el-button>
    </div>
  </AppToolbar>

  <el-row :gutter="20" class="report__figures">
    <el-col :span="8">
      <el-card class="card">
        <template #header> Total Earned </template>
        <div class="figure">
          {{ report ? new Intl.NumberFormat().format(report.totalEarned) : '-' }}
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card">
        <template #header> Total lecture </template>
        <span class="figure">{{ report ? report.totalLectures : '-' }}</span>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="card">
        <template #header> Total student </template>
        <span class="figure">{{ report ? report.totalStudents : '-' }}</span>
      </el-card>
    </el-col>
  </el-row>

  <el-table :data="report?.lectures" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="classCode" label="Code" width="125" />
    <el-table-column prop="date" label="Date" width="125">
      <template #default="scope">
        {{ moment(scope.row.startTime).format('DD-MMM-YYYY') }}
      </template>
    </el-table-column>
    <el-table-column prop="time" label="Time" width="150">
      <template #default="scope">
        {{ moment(scope.row.startTime).format('HH:mm') }}
        -
        {{ moment(scope.row.endTime).format('HH:mm') }}
      </template>
    </el-table-column>
    <el-table-column
      prop="student"
      label="Student"
      width="300"
      :filters="students"
      :filter-method="filterStudent"
    >
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

<style>
.report__figures .el-card__header,
.report__figures .el-card__body {
  padding: 12px 22px;
}
.report__figures .el-card__body {
  padding-top: 6px;
}
.report__figures .el-card__header {
  padding-bottom: 0;
  font-size: 0.9rem;
}
</style>
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

.report__figures {
  margin-bottom: 2rem;
  margin-top: 1.5rem;
  --el-box-shadow-light: 0 2px 10px -2px rgba(0, 0, 0, 0.1);
}

.report__figures .card {
  border: none;
  --el-card-border-color: transparent;
}

.report__figures .figure {
  color: var(--el-color-primary);
  font-weight: bold;
  font-size: 1.1rem;
}
</style>

<script lang="ts" setup>
import AppToolbar from '@/components/AppToolbar.vue'
import BackButton from '@/components/BackButton.vue'
import type { Lecture } from '@/models/lecture'
import type { Report, ReportRange } from '@/models/report'
import { exportXlsx, getReport } from '@/services/report-service'
import { IconCloudDownload } from '@tabler/icons-vue'
import { ElCard, ElCol, ElRow } from 'element-plus'
import moment from 'moment'
import { computed, onMounted, ref, watch } from 'vue'

const reportMonth = ref(new Date())
const exporting = ref(false)
const range = computed<ReportRange>(() => ({
  year: reportMonth.value.getFullYear(),
  month: reportMonth.value.getMonth() + 1
}))
const report = ref<Report>()
const students = computed(() => {
  const options = report.value?.lectures.map((l) => ({
    text: l.student.name,
    value: l.student.id
  }))
  const distinct = new Map(options?.map((o) => [o.value, o])).values()
  return Array.from(distinct)
})
const loading = ref(true)

const filterStudent = (value: number, row: Lecture) => row.student.id === value

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
    report.value = await getReport(range.value)
  } finally {
    loading.value = false
  }
}

onMounted(refreshReport)

watch(range, refreshReport)
</script>

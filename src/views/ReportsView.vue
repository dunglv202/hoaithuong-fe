<template>
  <AppToolbar>
    <BackButton />
    <el-row class="align-right" :gutter="16">
      <el-col :span="24" :sm="12">
        <el-date-picker v-model="reportMonth" type="month" placeholder="Pick a month" />
      </el-col>
      <el-col :span="12" :sm="6">
        <el-button class="btn" @click="reportPhaseDialog = true" :icon="IconMessage">
          Report
        </el-button>
      </el-col>
      <el-col :span="12" :sm="6">
        <el-dropdown trigger="click">
          <el-button type="primary" :icon="IconCloudDownload" :loading="exporting">
            Export
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="exportReport('excel')">Excel</el-dropdown-item>
              <el-dropdown-item @click="exportReport('ggsheet')">Google Sheet</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </AppToolbar>

  <el-row class="report__figures" :gutter="16">
    <el-col :span="24" :sm="12" :md="6">
      <el-card class="card">
        <template #header> Total Earned </template>
        <div class="figure">
          {{ report ? new Intl.NumberFormat().format(report.totalEarned) : '-' }}
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" :sm="12" :md="6">
      <el-card class="card">
        <template #header> Estimated Total </template>
        <div class="figure">
          {{ report ? new Intl.NumberFormat().format(report.estimatedTotal) : '-' }}
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" :sm="12" :md="6">
      <el-card class="card">
        <template #header> Total Lectures </template>
        <span class="figure">{{ report ? report.totalLectures : '-' }}</span>
      </el-card>
    </el-col>
    <el-col :span="24" :sm="12" :md="6">
      <el-card class="card">
        <template #header> Total Students </template>
        <span class="figure">{{ report ? report.totalStudents : '-' }}</span>
      </el-card>
    </el-col>
  </el-row>

  <el-table ref="tableRef" :data="report?.lectures" style="width: 100%" v-loading="loading">
    <el-table-column type="index" label="#" width="50" />
    <el-table-column prop="classCode" label="Code" width="125" />
    <el-table-column prop="date" label="Date" width="125">
      <template #default="scope">
        {{ moment(scope.row.startTime).format('DD-MMM') }}
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
      :filtered-value="studentFilter"
    >
      <template #default="scope">
        <span class="blue student-name" @click="setStudentFilter(scope.row.student)">
          {{ scope.row.student.name }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="topic" label="Topic" width="300" />
    <el-table-column prop="lecture" label="Lecture" :align="'right'">
      <template #default="scope"> {{ scope.row.lectureNo }}/{{ scope.row.totalLecture }} </template>
    </el-table-column>
  </el-table>

  <ReportPhasesDialog v-model="reportPhaseDialog" :lectures="report?.lectures || []" />
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
@media screen and (max-width: 768px) {
  .align-right {
    width: 100%;
    flex-grow: 1;
  }

  .toolbar .btn {
    width: 100%;
    margin-top: 16px;
  }
}

.toolbar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
}

.report__figures {
  margin-bottom: 16px;
  margin-top: 32px;
  --el-box-shadow-light: 0 1px 10px -2px #374c611a;
}

.report__figures .card {
  border: none;
  margin-bottom: 16px;
  --el-card-border-color: transparent;
}

.report__figures .figure {
  color: var(--el-color-primary);
  font-weight: bold;
  font-size: 1.1rem;
}

.student-name {
  cursor: pointer;
}
</style>

<script lang="ts" setup>
import AppToolbar from '@/components/AppToolbar.vue'
import BackButton from '@/components/BackButton.vue'
import ReportPhasesDialog from '@/components/ReportPhasesDialog.vue'
import type { ApiError } from '@/models/common'
import type { Lecture } from '@/models/lecture'
import type { Report, ReportRange } from '@/models/report'
import type { Student } from '@/models/student'
import {
  exportReport as doExportReport,
  downloadReport,
  getReport
} from '@/services/report-service'
import { IconCloudDownload, IconMessage } from '@tabler/icons-vue'
import { AxiosError } from 'axios'
import { ElCard, ElCol, ElRow, type TableInstance } from 'element-plus'
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
const studentFilter = ref<number[]>([])
const tableRef = ref<TableInstance>()
const reportPhaseDialog = ref(false)

const filterStudent = (value: number, row: Lecture) => row.student.id === value

const exportToGoogleSheet = async () => {
  try {
    await doExportReport(range.value)
  } catch (e) {
    if (e instanceof AxiosError && (e.response?.data as ApiError).code === 'REQUIRE_GOOGLE_AUTH') {
      location.href = '/oauth2/authorization/google'
    }
  }
}

const exportReport = async (type: 'excel' | 'ggsheet') => {
  exporting.value = true
  try {
    switch (type) {
      case 'excel':
        await downloadReport(range.value)
        break
      case 'ggsheet':
        await exportToGoogleSheet()
        break
    }
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

const setStudentFilter = (student: Student) => {
  if (studentFilter.value.length == 1 && studentFilter.value[0] === student.id) {
    studentFilter.value = []
  } else {
    studentFilter.value = [student.id]
  }
  tableRef.value?.store.commit('filterChange', {
    column: (tableRef.value?.columns as unknown as any[])[4],
    values: studentFilter.value
  })
}

onMounted(refreshReport)

watch(range, refreshReport)
</script>

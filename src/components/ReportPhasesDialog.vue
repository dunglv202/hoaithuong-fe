<template>
  <el-dialog v-model="visible" width="600" class="phases-dialog">
    <el-card class="phase_item" v-for="(phase, index) in phases" :key="index">
      <div class="phase__body">
        <p class="phase__content" v-html="phase.html"></p>
        <el-icon class="phase__copy-icon" :size="18" @click="copyPhase(phase)">
          <IconCopy class="hoverable" />
        </el-icon>
      </div>
    </el-card>
  </el-dialog>
</template>

<style>
.phases-dialog {
  max-height: 60vh;
  overflow-y: auto;
  padding: 2rem;
}
.phase__highlight {
  color: var(--el-color-primary);
}
</style>
<style scoped>
.phase_item {
  margin-bottom: 1rem;
  box-shadow: none;
}
.phase__body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
.phase__content {
  text-align: justify;
}
.phase__copy-icon {
  color: var(--el-text-color-regular);
}
</style>

<script lang="ts" setup>
import type { Lecture } from '@/models/lecture'
import { IconCopy } from '@tabler/icons-vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { computed } from 'vue'

interface Phase {
  text: string
  html: string
}

const visible = defineModel({ default: false })
const props = defineProps<{
  lectures: Lecture[]
}>()
const phases = computed<Phase[]>(() => {
  const lecturesByStudent = new Map<number, Lecture[]>()

  props.lectures.forEach((lecture) => {
    if (!lecturesByStudent.has(lecture.student.id)) {
      lecturesByStudent.set(lecture.student.id, [])
    }
    lecturesByStudent.get(lecture.student.id)?.push(lecture)
  })

  return Array.from(lecturesByStudent.values()).map((lectures) => {
    const student = lectures[0].student.name
    const month = moment(lectures[0].startTime).format('M')
    const days = lectures.map((lec) => moment(lec.startTime).format('d/M'))
    return {
      text: generatePhase(student, month, days),
      html: generatePhase(student, month, days, true)
    }
  })
})

const generatePhase = (student: string, month: string, days: string[], html?: boolean) => {
  const text = `
    Em xin được thông báo số buổi học của <highlight>${student}</highlight> trong tháng ${month} ạ.
    Tháng ${month} con học được <highlight>${days.length} buổi</highlight> (${days.join(', ')}).
    _ xác nhận giúp em với ạ
  `

  return html
    ? text
        .replaceAll('<highlight>', '<span class="phase__highlight">')
        .replaceAll('</highlight>', '</span>')
    : text.replaceAll('<highlight>', '').replaceAll('</highlight>', '')
}

const copyPhase = (phase: Phase) => {
  navigator.clipboard.writeText(phase.text)
  ElMessage({
    message: 'Text copied to clipboard',
    type: 'success'
  })
}
</script>

<template>
  <el-dialog v-model="visible" :title="editting ? 'Edit class' : 'New class'" width="700" @closed="resetForm">
    <el-form :model="form" :rules="formRules" ref="formRef" v-loading="loading">
      <el-form-item label="Code" label-width="110px" prop="code">
        <el-input v-model="form.code" autocomplete="off" :disabled="!active" />
      </el-form-item>
      <el-form-item label="Student" label-width="110px" prop="studentId">
        <el-select v-model="form.studentId" filterable remote reserve-keyword placeholder="Enter student's name"
          :remote-method="searchStudent" :loading="fetchingStudents" :disabled="editting || !active">
          <el-option v-for="student in students" :key="student.id" :label="student.name" :value="student.id" />
          <template #loading>
            <LoadingComponent />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="Level" label-width="110px" prop="level">
        <el-input v-model="form.level" autocomplete="off" :disabled="!active" />
      </el-form-item>
      <el-form-item label="Total lecture" label-width="110px" prop="totalLecture">
        <el-input-number v-model="form.totalLecture" autocomplete="off" :min="1" :disabled="editting || !active"
          :controls="false" />
      </el-form-item>
      <el-form-item v-if="!editting" label="New class?" label-width="110px">
        <el-switch v-model="isNewClass" :disabled="!active" />
      </el-form-item>
      <el-form-item v-if="editting || !isNewClass" label="Learned" label-width="110px" prop="learned">
        <el-input-number v-model="form.learned" autocomplete="off" :min="0" :disabled="editting || !active"
          :controls="false" />
      </el-form-item>
      <el-form-item label="Start Date" label-width="110px" prop="startDate">
        <el-date-picker v-model="form.startDate" type="date" format="DD/MM/YYYY" :disabled-date="isPastDate"
          :disabled="!active" />
      </el-form-item>
      <el-form-item label="Notes" label-width="110px" prop="notes">
        <el-input v-model="form.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" :disabled="!active" />
      </el-form-item>
      <el-form-item label="Schedule" label-width="110px" prop="schedules">
        <div class="schedule">
          <div class="timeslot" v-for="(_, index) in form.timeSlots" :key="index">
            <el-select filterable v-model="form.timeSlots[index].weekday" :disabled="!active">
              <el-option v-for="item in weekdays" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select filterable allow-create v-model="form.timeSlots[index].startTime" :filter-method="timeSlotFilter"
              :disabled="!active">
              <el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button @click="form.timeSlots.splice(index, 1)" :disabled="!active">
              <el-icon>
                <IconTrash />
              </el-icon>
            </el-button>
          </div>
          <div>
            <el-button type="primary" size="default" @click="addNewTimeSlot" v-show="active">
              Add
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label-width="110px">
        <div class="show-more" @click="showMoreDetails = !showMoreDetails">
          More details
          <el-icon>
            <IconChevronDown v-if="!showMoreDetails" />
            <IconChevronUp v-else />
          </el-icon>
        </div>
      </el-form-item>
      <div v-if="showMoreDetails">
        <el-form-item label="Duration" label-width="110px" prop="durationInMinute">
          <el-input-number v-model="form.durationInMinute" placeholder="70" autocomplete="off" :min="1"
            :disabled="editting || !active" :controls="false" />
        </el-form-item>
        <el-form-item label="Pay for lecture" label-width="110px" prop="payForLecture">
          <el-input-number v-model="form.payForLecture" placeholder="80,000" autocomplete="off" :min="0"
            :controls="false" :disabled="!active" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="submit" :loading="submitting" :icon="IconSquareRoundedCheck">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.show-more {
  color: #409eff;
  cursor: pointer;
  margin-top: -15px;
  margin-bottom: -15px;
  display: flex;
  align-items: center;
  gap: 3px;
}

.schedule {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex-grow: 1;
}

.timeslot {
  display: flex;
  gap: 0.5rem;
}
</style>

<script lang="ts" setup>
import LoadingComponent from '@/components/LoadingComponent.vue'
import { times, weekdays } from '@/models/common'
import type { Student } from '@/models/student'
import { type NewTutorClass } from '@/models/tutor-class'
import { fetchStudents } from '@/services/student-service'
import { addTutorClass, getDetailClass, updateTutorClass } from '@/services/tutor-class-service'
import {
  IconChevronDown,
  IconChevronUp,
  IconSquareRoundedCheck,
  IconTrash
} from '@tabler/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, reactive, ref, watch } from 'vue'

const visible = defineModel({ default: true })
const emit = defineEmits<{
  (e: 'save'): void
}>()
const props = defineProps<{
  id?: number
  clone?: boolean
}>()

const form = ref<NewTutorClass>({
  code: '',
  studentId: undefined,
  level: '',
  totalLecture: 20,
  learned: undefined,
  notes: undefined,
  timeSlots: [],
  durationInMinute: undefined,
  payForLecture: undefined,
  startDate: new Date()
})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules<typeof form>>({
  code: [{ required: true, message: 'Code is required', trigger: 'change' }],
  studentId: [{ required: true, message: 'Student is required', trigger: 'change' }],
  level: [{ required: true, message: 'Level is required', trigger: 'change' }],
  totalLecture: [{ required: true, message: 'Total lecture is required', trigger: 'change' }]
})
const students = ref<Student[]>([])
const fetchingStudents = ref(false)
const submitting = ref(false)
const isNewClass = ref(true)
const showMoreDetails = ref(false)
const editting = computed(() => !!props.id && !props.clone)
const loading = ref(false)
const timeOptions = ref(times)
const active = ref(true)

const searchStudent = async (query: string) => {
  fetchingStudents.value = true
  try {
    students.value = (await fetchStudents(query)).content
  } finally {
    fetchingStudents.value = false
  }
}

const addNewTimeSlot = () => {
  form.value.timeSlots.push({
    weekday: weekdays[0].value,
    startTime: times[0].value
  })
}

const submit = async () => {
  submitting.value = true
  try {
    await formRef.value?.validate()
    if (editting.value) {
      await updateTutorClass(props.id!, form.value)
    } else {
      await addTutorClass({ ...form.value, studentId: form.value.studentId! })
    }
    visible.value = false
    formRef.value?.resetFields()
    emit('save')
  } finally {
    submitting.value = false
  }
}

const isPastDate = (time: Date) => {
  const now = new Date()
  return time < new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const resetForm = () => {
  students.value = []
  form.value.timeSlots = []
  formRef.value?.resetFields()
}

const timeSlotFilter = (query?: string) => {
  if (!query) return
  timeOptions.value = times.filter((time) =>
    time.label.replaceAll(':', '').startsWith(query.trim())
  )
}

watch(
  () => props.id,
  async (id) => {
    if (id) {
      try {
        loading.value = true
        const detail = await getDetailClass(id)
        students.value = [detail.student]
        form.value = {
          ...detail,
          startDate: new Date(),
          studentId: detail.student.id,
          learned: props.clone ? 0 : detail.learned
        }
        active.value = detail.active
      } finally {
        loading.value = false
      }
    }
  }
)

watch(
  () => props.clone,
  (clone) => {
    if (clone) {
      form.value.learned = 0
    }
  }
)
</script>

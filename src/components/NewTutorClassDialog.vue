<template>
  <el-dialog v-model="visible" title="New class" width="700">
    <el-form :model="form" :rules="formRules" ref="formRef">
      <el-form-item label="Code" label-width="110px" prop="code">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Student" label-width="110px" prop="studentId">
        <el-select
          v-model="form.studentId"
          filterable
          remote
          reserve-keyword
          placeholder="Enter student's name"
          :remote-method="searchStudent"
          :loading="fetchingStudents"
        >
          <el-option
            v-for="student in students"
            :key="student.id"
            :label="student.name"
            :value="student.id"
          />
          <template #loading>
            <LoadingComponent />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="Level" label-width="110px" prop="level">
        <el-input v-model="form.level" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Total lecture" label-width="110px" prop="totalLecture">
        <el-input v-model="form.totalLecture" type="number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="New class?" label-width="110px">
        <el-switch v-model="isNewClass" />
      </el-form-item>
      <el-form-item v-if="!isNewClass" label="Learned" label-width="110px" prop="learned">
        <el-input v-model="form.learned" type="number" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Notes" label-width="110px" prop="notes">
        <el-input v-model="form.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
      <el-form-item label="Schedule" label-width="110px" prop="schedules">
        <div class="schedule">
          <div class="timeslot" v-for="(_, index) in form.schedule" :key="index">
            <el-select filterable v-model="form.schedule[index].weekday">
              <el-option
                v-for="item in weekdays"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select filterable v-model="form.schedule[index].startTime">
              <el-option
                v-for="item in times"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <el-button type="primary" size="medium" @click="addNewTimeSlot">Add</el-button>
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
          <el-input
            v-model="form.durationInMinute"
            placeholder="70"
            type="number"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="Pay for lecture" label-width="110px" prop="payForLecture">
          <el-input
            v-model="form.payForLecture"
            placeholder="80,000"
            type="number"
            autocomplete="off"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="addClass" :loading="submitting"> Confirm </el-button>
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
import type { Student } from '@/models/student'
import { times, weekdays } from '@/models/common'
import type { NewTutorClass } from '@/models/tutor-class'
import { fetchStudents } from '@/services/student-service'
import { addTutorClass } from '@/services/tutor-class-service'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const visible = defineModel({ default: true })
const emit = defineEmits<{
  (e: 'save'): void
}>()

const form = reactive<NewTutorClass>({
  code: '',
  studentId: undefined,
  level: '',
  totalLecture: 20,
  learned: undefined,
  notes: undefined,
  schedule: [],
  durationInMinute: undefined,
  payForLecture: undefined
})
const formRef = ref<FormInstance>()
const formRules = reactive<FormRules<typeof form>>({
  code: [{ required: true, message: 'Code is required', trigger: 'change' }],
  studentId: [{ required: true, message: 'Student is required', trigger: 'change' }],
  level: [{ required: true, message: 'Level is required', trigger: 'change' }],
  totalLecture: [{ required: true, message: 'Total lecture is required', trigger: 'change' }],
  durationInMinute: [{ min: 0, message: 'Invalid duration', trigger: 'change' }],
  payForLecture: [{ min: 0, message: 'Invalid pay amount', trigger: 'change' }]
})
const students = ref<Student[]>([])
const fetchingStudents = ref(false)
const submitting = ref(false)
const isNewClass = ref(true)
const showMoreDetails = ref(false)

const searchStudent = async (query: string) => {
  fetchingStudents.value = true
  try {
    students.value = await fetchStudents(query)
  } finally {
    fetchingStudents.value = false
  }
}

const addNewTimeSlot = () => {
  form.schedule.push({
    weekday: weekdays[0].value,
    startTime: times[0].value
  })
}

const addClass = async () => {
  submitting.value = true
  try {
    await formRef.value?.validate()
    await addTutorClass({ ...form, studentId: form.studentId! })
    visible.value = false
    formRef.value?.resetFields()
    emit('save')
  } finally {
    submitting.value = false
  }
}
</script>

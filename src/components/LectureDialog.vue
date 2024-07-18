<template>
  <el-dialog v-model="visible" title="New lecture" width="500">
    <el-form :model="form" :rules="formRules" ref="formRef">
      <el-form-item label="Student" label-width="110px" prop="classId">
        <el-select v-model="form.classId" filterable remote reserve-keyword placeholder="Enter student's name"
          :remote-method="searchClass" :loading="fetchingClasses" :disabled="!!schedule">
          <el-option v-for="item in tutorClasses" :key="item.id" :label="`${item.code} - ${item.student.name}`"
            :value="item.id" />
          <template #loading>
            <LoadingComponent />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="Start time" label-width="110px" prop="startTime">
        <el-date-picker v-model="form.startTime" type="datetime" format="DD/MM/YYYY HH:mm" :disabled="!!schedule" />
      </el-form-item>
      <el-form-item label="Topic" label-width="110px" prop="topic">
        <el-input v-model="form.topic" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Notes" label-width="110px" prop="notes">
        <el-input v-model="form.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="addLecture" :loading="submitting"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import LoadingComponent from '@/components/LoadingComponent.vue'
import type { Schedule } from '@/models/schedule'
import type { TutorClass } from '@/models/tutor-class'
import { addNewLecture } from '@/services/lecture-service'
import { fetchTutorClasses } from '@/services/tutor-class-service'
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

interface NewLectureForm {
  classId?: number
  startTime?: Date
  topic: string
  notes?: string
}

const visible = defineModel({ default: true })
const props = defineProps<{
  schedule?: Schedule,
  startTime?: Date
}>()
const emit = defineEmits<{
  (e: 'save'): void
}>()

const fetchingClasses = ref(false)
const form = reactive<NewLectureForm>({
  classId: undefined,
  startTime: props.schedule ? new Date(props.schedule.startTime) : props.startTime || new Date(),
  topic: '',
  notes: ''
})
const formRules = reactive<FormRules<NewLectureForm>>({
  classId: [{ required: true, message: 'Class is required', trigger: 'change' }],
  startTime: [{ required: true, message: 'Start time is required', trigger: 'change' }],
  topic: [{ required: true, message: 'Topic is required', trigger: 'change' }]
})
const formRef = ref<FormInstance>()
const tutorClasses = ref<TutorClass[]>(props.schedule ? [props.schedule.tutorClass] : [])
const submitting = ref(false)

const searchClass = async (keyword: string) => {
  fetchingClasses.value = true
  try {
    tutorClasses.value = await fetchTutorClasses({ active: true, keyword: keyword || undefined })
  } finally {
    fetchingClasses.value = false
  }
}

const addLecture = async () => {
  submitting.value = true
  try {
    await formRef.value?.validate()
    console.log(props.schedule)
    await addNewLecture({
      classId: form.classId || -1,
      startTime: !props.schedule ? form.startTime : undefined,
      topic: form.topic,
      notes: form.notes,
      scheduleId: props.schedule?.id
    })
    visible.value = false
    formRef.value?.resetFields()
    emit('save')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (props.schedule) {
    form.classId = props.schedule.tutorClass.id

    if (props.schedule.lecture) {
      form.topic = props.schedule.lecture.topic
      form.notes = props.schedule.lecture.notes
    }
  }
})
</script>

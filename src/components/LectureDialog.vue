<template>
  <el-dialog v-model="visible" :title="isFutureTime ? 'Schedule info' : 'Lecture info'" width="500">
    <el-form :model="form" :rules="formRules" ref="formRef">
      <el-form-item label="Student" label-width="110px" prop="classId">
        <el-select
          v-model="form.classId"
          filterable
          remote
          reserve-keyword
          placeholder="Enter student's name"
          :remote-method="searchClass"
          :loading="fetchingClasses"
          :disabled="!!schedule"
        >
          <el-option
            v-for="item in tutorClasses"
            :key="item.id"
            :label="`${item.code} - ${item.student.name}`"
            :value="item.id"
          />
          <template #loading>
            <LoadingComponent />
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="Start time" label-width="110px" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="datetime"
          format="DD/MM/YYYY HH:mm"
          :disabled="!!schedule"
        />
      </el-form-item>
      <el-form-item v-show="!isFutureTime" label="Topic" label-width="110px" prop="topic">
        <el-input v-model="form.topic" autocomplete="off" />
      </el-form-item>
      <el-form-item v-show="!isFutureTime" label="Comment" label-width="110px" prop="comment">
        <el-input v-model="form.comment" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
      </el-form-item>
      <el-form-item v-show="!isFutureTime" label="Notes" label-width="110px" prop="notes">
        <el-input
          v-model="form.notes"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          resize="none"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!!schedule" @click="removeFromSchedule" :icon="IconTrash" />
        <el-button @click="visible = false">Cancel</el-button>
        <el-button
          :disabled="isFutureTime && schedule"
          type="primary"
          @click="submit"
          :loading="submitting"
          :icon="IconSquareRoundedCheck"
        >
          {{ isFutureTime ? 'Save schedule' : 'Save' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import LoadingComponent from '@/components/LoadingComponent.vue'
import type { Schedule } from '@/models/schedule'
import type { TutorClass } from '@/models/tutor-class'
import { addNewLecture, updateLecture } from '@/services/lecture-service'
import { addSchedule, deleteSchedule } from '@/services/schedule-service'
import { fetchTutorClasses } from '@/services/tutor-class-service'
import { IconSquareRoundedCheck, IconTrash } from '@tabler/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'

interface NewLectureForm {
  classId?: number
  startTime?: Date
  topic: string
  comment?: string
  notes?: string
}

const visible = defineModel({ default: true })
const props = defineProps<{
  schedule?: Schedule
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
  comment: '',
  notes: ''
})
const isFutureTime = computed(() => form.startTime && form.startTime > new Date())
const formRules = reactive<FormRules<NewLectureForm>>({
  classId: [{ required: true, message: 'Class is required', trigger: 'change' }],
  startTime: [{ required: true, message: 'Start time is required', trigger: 'change' }],
  topic: [{ required: !isFutureTime.value, message: 'Topic is required', trigger: 'change' }]
})
const formRef = ref<FormInstance>()
const tutorClasses = ref<TutorClass[]>(props.schedule ? [props.schedule.tutorClass] : [])
const submitting = ref(false)

const searchClass = async (keyword: string) => {
  fetchingClasses.value = true
  try {
    tutorClasses.value = (
      await fetchTutorClasses({ active: true, keyword: keyword || undefined })
    ).content
  } finally {
    fetchingClasses.value = false
  }
}

const submit = async () => {
  submitting.value = true
  try {
    await formRef.value?.validate()
    if (isFutureTime.value) {
      console.log(isFutureTime)
      // save as schedule
      await addSchedule({
        classId: form.classId!,
        startTime: form.startTime!
      })
    } else {
      // save as lecture
      if (!props.schedule?.lecture) {
        await addNewLecture({
          classId: form.classId!,
          startTime: !props.schedule ? form.startTime : undefined,
          topic: form.topic,
          comment: form.comment,
          notes: form.notes,
          scheduleId: props.schedule?.id
        })
      } else {
        await updateLecture({
          id: props.schedule.lecture.id,
          topic: form.topic,
          comment: form.comment,
          notes: form.notes
        })
      }
    }
    visible.value = false
    formRef.value?.resetFields()
    emit('save')
  } finally {
    submitting.value = false
  }
}

const removeFromSchedule = async () => {
  await deleteSchedule(props.schedule!.id)
  emit('save')
  visible.value = false
}

onMounted(() => {
  if (props.schedule) {
    form.classId = props.schedule.tutorClass.id

    if (props.schedule.lecture) {
      form.topic = props.schedule.lecture.topic
      form.comment = props.schedule.lecture.comment
      form.notes = props.schedule.lecture.notes
    }
  }
})
</script>

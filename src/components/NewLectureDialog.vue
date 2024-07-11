<template>
  <el-dialog v-model="visible" title="New lecture" width="500">
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
      <el-form-item label="Duration" label-width="110px" prop="duration">
        <el-date-picker
          v-model="form.duration"
          type="datetimerange"
          range-separator="To"
          start-placeholder="Start"
          end-placeholder="End"
          format="DD/MM/YYYY HH:mm"
        />
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
import type { TutorClass } from '@/models/tutor-class'
import { addNewLecture } from '@/services/lecture-service'
import { fetchTutorClasses } from '@/services/tutor-class-service'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const visible = defineModel({ default: true })
const emit = defineEmits<{
  (e: 'save'): void
}>()

const fetchingClasses = ref(false)
const form = reactive({
  classId: undefined,
  duration: [new Date(), new Date()],
  topic: '',
  notes: ''
})
const formRules = reactive<FormRules<typeof form>>({
  classId: [{ required: true, message: 'Class is required', trigger: 'change' }],
  duration: [{ required: true, message: 'Duration is required', trigger: 'change' }],
  topic: [{ required: true, message: 'Topic is required', trigger: 'change' }]
})
const formRef = ref<FormInstance>()
const tutorClasses = ref<TutorClass[]>([])
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
    await addNewLecture({
      classId: form.classId || -1,
      startTime: form.duration[0],
      endTime: form.duration[1],
      topic: form.topic,
      notes: form.notes
    })
    visible.value = false
    emit('save')
  } finally {
    submitting.value = false
  }
}
</script>

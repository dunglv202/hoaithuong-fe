<template>
  <el-dialog v-model="dialogModel.visible" title="New student" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="Name" label-width="110px" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Report to" label-width="110px" prop="reportTo.name">
        <el-input v-model="form.reportTo.name" autocomplete="off">
          <template #prepend>
            <el-select v-model="form.reportTo.salutation" style="width: 110px">
              <el-option
                v-for="opt in salutations"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Notes" label-width="110px">
        <el-input
          v-model="form.notes"
          :rows="2"
          type="textarea"
          autocomplete="off"
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogModel.visible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitting"
          :icon="IconSquareRoundedCheck"
        >
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { salutations, type NewStudent, type Salutation, type Student } from '@/models/student'
import { addStudent, updateStudent } from '@/services/student-service'
import { IconSquareRoundedCheck } from '@tabler/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

export interface StudentDialogModel {
  visible: boolean
  student?: Student
}

const dialogModel = defineModel<StudentDialogModel>({
  default: {
    visible: false
  }
})
const emit = defineEmits<{
  (e: 'save'): void
}>()

const form = ref<NewStudent>({
  name: '',
  reportTo: {
    salutation: 'MR' as Salutation,
    name: ''
  },
  notes: ''
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof form>>({
  name: [{ required: true, message: 'Name is required', trigger: 'change' }],
  'reportTo.name': [{ required: true, message: 'Report to is required', trigger: 'change' }]
})
const submitting = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  try {
    await formRef.value?.validate()
    if (dialogModel.value.student) {
      await updateStudent(dialogModel.value.student.id, form.value)
    } else {
      await addStudent(form.value)
    }
    dialogModel.value.visible = false
    formRef.value?.resetFields()
    emit('save')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (dialogModel.value.student) {
    form.value = dialogModel.value.student
  }
})
</script>

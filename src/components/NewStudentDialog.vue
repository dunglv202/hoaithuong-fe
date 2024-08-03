<template>
  <el-dialog v-model="visible" title="New student" width="500">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item label="Name" label-width="110px" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
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
        <el-button @click="visible = false">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleAddStudent"
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
import type { NewStudent } from '@/models/student'
import { addStudent } from '@/services/student-service'
import { IconSquareRoundedCheck } from '@tabler/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

const visible = defineModel({ default: true })
const emit = defineEmits<{
  (e: 'save'): void
}>()

const form = reactive<NewStudent>({
  name: '',
  notes: ''
})
const formRef = ref<FormInstance>()
const rules = reactive<FormRules<typeof form>>({
  name: [{ required: true, message: 'Name is required', trigger: 'change' }]
})
const submitting = ref(false)

const handleAddStudent = async () => {
  submitting.value = true
  try {
    await formRef.value?.validate()
    await addStudent(form)
    visible.value = false
    formRef.value?.resetFields()
    emit('save')
  } finally {
    submitting.value = false
  }
}
</script>

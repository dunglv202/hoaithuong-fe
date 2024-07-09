<template>
    <el-dialog v-model="visible" title="New student" width="500">
        <el-form :model="addStudentForm">
            <el-form-item label="Name" label-width="100px">
                <el-input v-model="addStudentForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Notes" label-width="100px">
                <el-input v-model="addStudentForm.notes" :rows="2" type="textarea" autocomplete="off"
                    :autosize="{ minRows: 2, maxRows: 4 }" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">Cancel</el-button>
                <el-button type="primary" @click="handleAddStudent">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { addStudent } from '@/services/student-service';
import { reactive } from 'vue';

const visible = defineModel({ default: true })
const emit = defineEmits<{
    (e: 'save'): void
}>();

const addStudentForm = reactive({
    name: '',
    notes: '',
})

const handleAddStudent = async () => {
    await addStudent(addStudentForm)
    visible.value = false
    emit('save')
}
</script>
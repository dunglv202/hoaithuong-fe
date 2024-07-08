<template>
    <div class="toolbar">
        <BackButton />
        <el-button type="primary" @click="handleAdd">Add</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="Name" width="500" />
        <el-table-column prop="notes" label="Notes" />
    </el-table>

    <el-dialog v-model="addStudentDialog" title="New student" width="500">
        <el-form :model="addStudentForm">
            <el-form-item label="Name" label-width="140px">
                <el-input v-model="addStudentForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Notes" label-width="140px">
                <el-input v-model="addStudentForm.notes" :rows="2" type="textarea" autocomplete="off"
                    :autosize="{ minRows: 2, maxRows: 4 }" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addStudentDialog = false">Cancel</el-button>
                <el-button type="primary" @click="addStudentDialog = false">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { Student } from '@/models/student';
import BackButton from '@/components/BackButton.vue';
import { reactive, ref } from 'vue';

const addStudentDialog = ref(false);
const addStudentForm = reactive({
    name: '',
    notes: '',
})

const handleAdd = () => {
    addStudentDialog.value = true;
}

const tableData: Student[] = [
    {
        id: 1,
        name: 'John Doe',
    },
    {
        id: 2,
        name: 'Jane Doe',
    },
    {
        id: 3,
        name: 'Alice',
    },
    {
        id: 4,
        name: 'Bob',
    }
]
</script>
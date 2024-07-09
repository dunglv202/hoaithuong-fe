<template>
    <el-dialog v-model="visible" title="New class" width="500">
        <el-form :model="addClassForm">
            <el-form-item label="Code" label-width="100px">
                <el-input v-model="addClassForm.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Student" label-width="100px">
                <el-select v-model="addClassForm.studentId" filterable remote reserve-keyword
                    placeholder="Enter student's name" :remote-method="searchStudent" :loading="fetchingStudents">
                    <el-option v-for="student in students" :key="student.id" :label="student.name"
                        :value="student.id" />
                    <template #loading>
                        <LoadingComponent />
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="Level" label-width="100px">
                <el-select v-model="addClassForm.levelCode">
                    <el-option v-for="level in levels" :key="level.code" :label="level.label" :value="level.code" />
                </el-select>
            </el-form-item>
            <el-form-item label="Total lecture" label-width="100px">
                <el-input v-model="addClassForm.totalLecture" type="number" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Notes" label-width="100px">
                <el-input v-model="addClassForm.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">Cancel</el-button>
                <el-button type="primary" @click="addClass" :loading="submitting">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import LoadingComponent from '@/components/LoadingComponent.vue';
import type { Level } from '@/models/level';
import type { Student } from '@/models/student';
import { type NewTutorClass } from '@/models/tutor-class';
import { fetchLevels } from '@/services/level-service';
import { fetchStudents } from '@/services/student-service';
import { addTutorClass } from '@/services/tutor-class-service';
import { onMounted, reactive, ref } from 'vue';

const visible = defineModel({ default: true })
const emit = defineEmits<{
    (e: 'save'): void
}>();

const addClassForm = reactive<NewTutorClass>({
    code: '',
    studentId: undefined,
    levelCode: undefined,
    totalLecture: 20,
    notes: undefined
})
const students = ref<Student[]>([])
const levels = ref<Level[]>([])
const fetchingStudents = ref(false)
const submitting = ref(false)

const loadLevels = async () => {
    levels.value = await fetchLevels()
}

const searchStudent = async (query: string) => {
    fetchingStudents.value = true
    try {
        students.value = await fetchStudents(query)
    } finally {
        fetchingStudents.value = false
    }
}

const addClass = async () => {
    submitting.value = true
    try {
        await addTutorClass(addClassForm)
        visible.value = false
        emit('save')
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    loadLevels()
})
</script>
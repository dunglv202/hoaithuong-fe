<template>
    <div class="toolbar">
        <BackButton />
        <el-button type="primary" @click="openAddClassDialog">Add</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="code" label="Code" width="150" />
        <el-table-column prop="student" label="Student" width="300">
            <template #default="scope">
                <RouterLink :to="'/students/' + scope.row.id">
                    {{ scope.row.student.name }}
                </RouterLink>
            </template>
        </el-table-column>
        <el-table-column prop="level" label="Level" width="230" />
        <el-table-column prop="learned" label="Learned" width="100" :align="'right'" />
        <el-table-column prop="active" label="Status" :align="'center'">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'error'">
                    {{ scope.row.active ? 'Active' : 'Ended' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="notes" label="Notes"></el-table-column>
    </el-table>

    <el-dialog v-model="addClassDialog" title="New class" width="500">
        <el-form :model="addClassForm">
            <el-form-item label="Code" label-width="100px">
                <el-input v-model="addClassForm.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Student" label-width="100px">
                <el-select v-model="addClassForm.student" filterable remote reserve-keyword
                    placeholder="Enter student's name" :remote-method="searchStudent" :loading="fetchingStudents">
                    <el-option v-for="item in students" :key="item.id" :label="item.name" :value="item.id" />
                    <template #loading>
                        <LoadingComponent />
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="Level" label-width="100px">
                <el-select v-model="addClassForm.level">
                    <el-option v-for="item in levels" :key="item.code" :label="item.label" :value="item.code" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addClassDialog = false">Cancel</el-button>
                <el-button type="primary" @click="addClassDialog = false">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.toolbar {
    margin-bottom: 1rem;
}
</style>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue';
import LoadingComponent from '@/components/LoadingComponent.vue'
import type { Level } from '@/models/level';
import type { Student } from '@/models/student';
import type { TutorClass } from '@/models/tutor-class';
import { onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';

const addClassDialog = ref(false)
const addClassForm = reactive({
    code: '',
    student: '',
    level: '',
})
const students = ref<Student[]>([])
const levels = ref<Level[]>([])
const fetchingStudents = ref(false)

onMounted(() => {
    fetchLevels()
})

const fetchLevels = async () => {
    levels.value = [
        {
            code: 'beginner',
            label: 'Beginner',
        },
        {
            code: 'intermediate',
            label: 'Intermediate',
        },
        {
            code: 'advanced',
            label: 'Advanced',
        }
    ]
}

const searchStudent = async (query: string) => {
    fetchingStudents.value = true
    setTimeout(() => {
        students.value = [
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
        ].filter(student => student.name.toLowerCase().includes(query.toLowerCase()))
        fetchingStudents.value = false
    }, 300)
}

const openAddClassDialog = () => {
    addClassDialog.value = true;
}

const tableData: TutorClass[] = [
    {
        id: 1,
        code: 'MATH101',
        student: {
            id: 1,
            name: 'John Doe',
        },
        level: 'Beginner',
        learned: 15,
        active: true,
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    }
]
</script>
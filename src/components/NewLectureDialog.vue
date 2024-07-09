<template>
    <el-dialog v-model="visible" title="New lecture" width="500">
        <el-form :model="addLectureForm">
            <el-form-item label="Student" label-width="100px">
                <el-select v-model="addLectureForm.tutorClass" filterable remote reserve-keyword
                    placeholder="Enter student's name" :remote-method="searchClass" :loading="fetchingClasses">
                    <el-option v-for="item in tutorClasses" :key="item.id" :label="`${item.code} - ${item.student}`"
                        :value="item.id" />
                    <template #loading>
                        <LoadingComponent />
                    </template>
                </el-select>
            </el-form-item>
            <el-form-item label="Duration" label-width="100px">
                <el-date-picker v-model="addLectureForm.duration" type="datetimerange" range-separator="To"
                    start-placeholder="Start" end-placeholder="End" format="YYYY/MM/DD HH:mm" />
            </el-form-item>
            <el-form-item label="Topic" label-width="100px">
                <el-input v-model="addLectureForm.topic" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Notes" label-width="100px">
                <el-input v-model="addLectureForm.notes" type="textarea" :autosize="{ minRows: 3, maxRows: 6 }" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="visible = false">Cancel</el-button>
                <el-button type="primary" @click="visible = false">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import LoadingComponent from '@/components/LoadingComponent.vue';
import type { TutorClassByStudent } from '@/models/tutor-class';
import { reactive, ref } from 'vue';

const visible = defineModel({ default: true })
const fetchingClasses = ref(false)
const addLectureForm = reactive({
    tutorClass: '',
    duration: [new Date(), new Date()],
    topic: '',
    notes: '',
})
const tutorClasses = ref<TutorClassByStudent[]>([]);

const searchClass = async (keyword: string) => {
    fetchingClasses.value = true;
    try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        tutorClasses.value = [
            {
                id: 1,
                code: 'MATH101',
                student: 'John Doe',
            },
            {
                id: 2,
                code: 'MATH102',
                student: 'Jane Doe',
            },
            {
                id: 3,
                code: 'MATH103',
                student: 'Alice',
            },
            {
                id: 4,
                code: 'MATH104',
                student: 'Bob',
            },
        ].filter((item) => item.student.toLowerCase().includes(keyword.toLowerCase()));
    } finally {
        fetchingClasses.value = false;
    }
}
</script>
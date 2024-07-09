<template>
    <el-dialog v-model="visible" title="New lecture" width="500">
        <el-form :model="addLectureForm">
            <el-form-item label="Student" label-width="100px">
                <el-select v-model="addLectureForm.classId" filterable remote reserve-keyword
                    placeholder="Enter student's name" :remote-method="searchClass" :loading="fetchingClasses">
                    <el-option v-for="item in tutorClasses" :key="item.id"
                        :label="`${item.code} - ${item.student.name}`" :value="item.id" />
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
                <el-button type="primary" @click="addLecture" :loading="submitting">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import LoadingComponent from '@/components/LoadingComponent.vue';
import type { TutorClass } from '@/models/tutor-class';
import { addNewLecture } from '@/services/lecture-service';
import { fetchTutorClasses } from '@/services/tutor-class-service';
import { reactive, ref } from 'vue';

const visible = defineModel({ default: true })
const emit = defineEmits<{
    (e: 'save'): void
}>();

const fetchingClasses = ref(false)
const addLectureForm = reactive({
    classId: undefined,
    duration: [new Date(), new Date()],
    topic: '',
    notes: '',
})
const tutorClasses = ref<TutorClass[]>([])
const submitting = ref(false)

const searchClass = async (keyword: string) => {
    fetchingClasses.value = true
    try {
        tutorClasses.value = await fetchTutorClasses(keyword)
        console.log(tutorClasses.value)
    } finally {
        fetchingClasses.value = false
    }
}

const addLecture = async () => {
    submitting.value = true
    try {
        await addNewLecture({
            classId: addLectureForm.classId || -1,
            startTime: addLectureForm.duration[0],
            endTime: addLectureForm.duration[0],
            topic: addLectureForm.topic,
            notes: addLectureForm.notes,
        })
        console.log('Lecture added')
        visible.value = false
        emit('save')
    } finally {
        submitting.value = false
    }
}
</script>
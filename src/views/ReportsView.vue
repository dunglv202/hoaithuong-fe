<template>
    <div class="toolbar">
        <BackButton />
        <div class="align-right">
            <el-date-picker v-model="reportMonth" type="month" placeholder="Pick a month" />
            <el-button type="primary" @click="downloadReport" :loading="exporting">
                Export
                <el-icon :size="18" style="margin-left: 7px; margin-right: -3px;">
                    <IconDownload />
                </el-icon>
            </el-button>
        </div>
    </div>
</template>

<style scoped>
.toolbar {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
}

.align-right {
    display: flex;
    gap: 1rem;
}
</style>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue';
import { exportXlsx } from '@/services/report-service';
import { IconDownload } from '@tabler/icons-vue';
import { ref } from 'vue';

const reportMonth = ref(new Date())
const exporting = ref(false)

const downloadReport = async () => {
    const year = reportMonth.value.getUTCFullYear()
    const month = reportMonth.value.getUTCMonth() + 1
    exporting.value = true
    try {
        await exportXlsx({ year, month })
    } finally {
        exporting.value = false
    }
}
</script>
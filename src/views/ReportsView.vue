<template>
    <div class="toolbar">
        <BackButton />
        <div class="align-right">
            <el-date-picker v-model="reportMonth" type="month" placeholder="Pick a month" />
            <el-button type="primary">
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
import { IconDownload } from '@tabler/icons-vue';
import { ref, watch } from 'vue';

const reportMonth = ref(new Date());

watch(reportMonth, (newValue) => {
    // console.log(newValue.getFullYear(), newValue.getMonth() + 1);
})
</script>
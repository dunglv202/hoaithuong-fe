<template>
    <el-button @click="goBack">
        <el-icon>
            <IconChevronLeft />
        </el-icon>
    </el-button>
</template>

<script lang="ts" setup>
import { IconChevronLeft } from '@tabler/icons-vue'

const goBack = () => {
    window.history.back()
}
</script>
<template>
    <RouterLink class="link" :to="to">
        <el-card class="card" style="max-width: 480px">
            <div class="wrapper">
                <el-icon>
                    <slot name="icon"></slot>
                </el-icon>
                <el-text class="label" v-if="$slots.label">
                    <slot name="label"></slot>
                </el-text>
            </div>
        </el-card>
    </RouterLink>
</template>

<style scoped>
.wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.card,
.label {
    color: inherit
}

.link {
    padding: 0;
    color: initial;
}

.link:hover {
    color: var(--vt-c-green);
}
</style>

<script lang="ts" setup>
import { RouterLink } from 'vue-router';

const { to } = defineProps<{
    to: string;
}>();
</script>
<template>
    <div class="nav">
        <el-button class="btn-close" :icon="IconX" circle />
    </div>
    <div class="container">
        <el-avatar :size="100" src="https://empty" @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>
        <div>
            <span class="name">Luu Van Dung</span>
        </div>
        <el-form label-position="left">
            <el-form-item label="Google Sheet ID" label-width="150px">
                <el-input class="inp" v-model="profile.configs" placeholder="Enter URL or sheet ID" />
            </el-form-item>
            <el-button class="fullwidth" type="primary">
                Save
            </el-button>
        </el-form>
    </div>
</template>

<style scoped>
.nav {
    position: sticky;
    top: 0;
}

.btn-close {
    float: right;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-top: 100px;
}

.fullwidth {
    width: 100%;
}

.inp {
    width: 300px;
}

.name {
    font-size: 1.5rem;
    font-weight: 500;
}
</style>

<script lang="ts" setup>
import { IconX } from '@tabler/icons-vue';
import { onMounted, reactive } from 'vue';

const profile = reactive({})

onMounted(async () => {
})
</script>
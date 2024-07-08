<template>
    <nav id="main-nav">
        <HomeCard to="/" @click="showNewLectureDialog = true">
            <template #label>New lecture</template>
            <template #icon>
                <IconPlus />
            </template>
        </HomeCard>
        <HomeCard to="/students">
            <template #label>Students</template>
            <template #icon>
                <IconUsers />
            </template>
        </HomeCard>
        <HomeCard to="/classes">
            <template #label>Classes</template>
            <template #icon>
                <IconSchool />
            </template>
        </HomeCard>
        <HomeCard to="/reports">
            <template #label>Reports</template>
            <template #icon>
                <IconReport />
            </template>
        </HomeCard>
    </nav>

    <NewLectureDialog v-model="showNewLectureDialog" />
</template>

<style scoped>
#main-nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 80%;
}
</style>

<script lang="ts" setup>
import HomeCard from "@/components/HomeCard.vue";
import { IconPlus, IconReport, IconSchool, IconUsers } from "@tabler/icons-vue";
import NewLectureDialog from "@/components/NewLectureDialog.vue";
import { ref } from "vue";

const showNewLectureDialog = ref(false)
</script>
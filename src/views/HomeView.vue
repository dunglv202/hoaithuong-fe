<template>
    <nav id="main-nav">
        <HomeCard to="/lectures/new">
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
    </nav>
</template>

<style>
#app {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>

<style scoped>
#main-nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
}
</style>

<script lang="ts" setup>
import HomeCard from "@/components/HomeCard.vue";
import { IconPlus, IconSchool, IconUsers } from "@tabler/icons-vue";
</script>
<template>
    <nav id="main-nav">
        <HomeCard to="/schedule">
            <template #label>Schedule</template>
            <template #icon>
                <IconCalendarClock />
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
import { IconCalendarClock, IconReport, IconSchool, IconUsers } from "@tabler/icons-vue";
</script>
<template>
  <nav id="main-nav">
    <el-row :gutter="16" class="container">
      <el-col class="card" :span="24" :sm="12" :lg="6">
        <HomeCard to="/schedule">
          <template #label>Schedule</template>
          <template #icon>
            <IconCalendarClock />
          </template>
        </HomeCard>
      </el-col>
      <el-col class="card" :span="24" :sm="12" :lg="6">
        <HomeCard to="/students">
          <template #label>Students</template>
          <template #icon>
            <IconUsers />
          </template>
        </HomeCard>
      </el-col>
      <el-col class="card" :span="24" :sm="12" :lg="6">
        <HomeCard to="/classes">
          <template #label>Classes</template>
          <template #icon>
            <IconSchool />
          </template>
        </HomeCard>
      </el-col>
      <el-col class="card" :span="24" :sm="12" :lg="6">
        <HomeCard to="/reports">
          <template #label>Reports</template>
          <template #icon>
            <IconReport />
          </template>
        </HomeCard>
      </el-col>
    </el-row>
  </nav>
</template>

<style scoped>
#main-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 80%;
}

.container {
  max-width: 80%;
}

.card {
  margin-bottom: 16px;
}
</style>

<script lang="ts" setup>
import HomeCard from "@/components/HomeCard.vue";
import { IconCalendarClock, IconReport, IconSchool, IconUsers } from "@tabler/icons-vue";
</script>
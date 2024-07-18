<template>
  <div class="toolbar">
    <BackButton />
  </div>
  <FullCalendar :options="calendarOptions"> </FullCalendar>
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
</style>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { onMounted, reactive } from 'vue'
import type { CalendarOptions } from '@fullcalendar/core'
import { getSchedule } from '@/services/schedule-service'

const now = new Date()
now.setMinutes(now.getMinutes() - 300)

const calendarOptions = reactive<CalendarOptions>({
  selectable: true,
  plugins: [interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  slotMinTime: '08:00',
  slotMaxTime: '23:00',
  allDaySlot: false,
  height: 'auto',
  events: [],
  select: (arg: any) => {
    console.log(arg)
  }
})

const fetchSchedule = async () => {
  const schedule = await getSchedule({
    from: new Date(2024, 1, 1),
    to: new Date(2024, 12, 31)
  })
  calendarOptions.events = schedule.map((s) => ({
    title: `${s.tutorClass.code} - ${s.tutorClass.student.name}`,
    start: s.startTime,
    end: s.endTime,
  }))
}

onMounted(() => fetchSchedule())
</script>

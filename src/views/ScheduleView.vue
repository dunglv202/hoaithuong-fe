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
import { reactive } from 'vue'
import type { CalendarOptions } from '@fullcalendar/core'

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
  events: [
    {
      start: new Date(2024, 6, 15, 10, 0, 0),
      end: new Date(2024, 6, 15, 11, 10, 0),
      title: 'Dạy học sinh'
    }
  ],
  select: (arg: any) => {
    console.log(arg)
  }
})
</script>

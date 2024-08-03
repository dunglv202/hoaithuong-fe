<template>
  <div class="toolbar">
    <BackButton />
  </div>
  <FullCalendar :options="calendarOptions"></FullCalendar>
  <LectureDialog
    v-if="showLectureDialog"
    v-model="showLectureDialog"
    :startTime="selectedStartTime"
    :schedule="selectedSchedule"
    @save="fetchSchedule"
  />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}
</style>
<style>
.fc-warn {
  background-color: #ffc550;
}

.fc-warn:hover {
  background-color: #ffd174;
}

.fc-upcoming {
  background-color: #617589;
}

.fc-upcoming:hover {
  background-color: #7088a2;
}
</style>

<script lang="ts" setup>
import BackButton from '@/components/BackButton.vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { onMounted, reactive, ref } from 'vue'
import type { CalendarOptions } from '@fullcalendar/core'
import { getSchedule } from '@/services/schedule-service'
import LectureDialog from '@/components/LectureDialog.vue'
import type { Schedule } from '@/models/schedule'

const showLectureDialog = ref(false)
const selectedStartTime = ref<Date>()
const selectedSchedule = ref<Schedule>()
const calendarOptions = reactive<CalendarOptions>({
  selectable: true,
  plugins: [interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  firstDay: 1,
  slotMinTime: '08:00',
  slotMaxTime: '23:00',
  allDaySlot: false,
  height: 'auto',
  events: [],
  select: (arg) => {
    selectedStartTime.value = arg.start
    selectedSchedule.value = undefined
    showLectureDialog.value = true
  },
  eventClick: (arg) => {
    selectedSchedule.value = arg.event.extendedProps.schedule
    selectedStartTime.value = undefined
    showLectureDialog.value = true
  }
})

const getEventColorClass = (schedule: Schedule) => {
  const now = new Date()
  if (!schedule.lecture && now > new Date(schedule.startTime)) {
    return 'fc-warn'
  } else if (!schedule.lecture && now < new Date(schedule.startTime)) {
    return 'fc-upcoming'
  } else {
    return ''
  }
}

const fetchSchedule = async () => {
  const schedule = await getSchedule({
    from: new Date(2024, 1, 1),
    to: new Date(2024, 12, 31)
  })

  calendarOptions.events = schedule.map((s) => ({
    title: `${s.tutorClass.code} - ${s.tutorClass.student.name}`,
    start: s.startTime,
    end: s.endTime,
    extendedProps: {
      schedule: s
    },
    className: getEventColorClass(s)
  }))
}

onMounted(() => fetchSchedule())
</script>

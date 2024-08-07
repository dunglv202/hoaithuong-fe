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
    @save="fetchSchedule(fetchedRange)"
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
import LectureDialog from '@/components/LectureDialog.vue'
import { type Range } from '@/models/common'
import type { Schedule } from '@/models/schedule'
import { getSchedule } from '@/services/schedule-service'
import type { CalendarOptions } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import moment from 'moment'
import { onMounted, reactive, ref } from 'vue'

const showLectureDialog = ref(false)
const selectedStartTime = ref<Date>()
const selectedSchedule = ref<Schedule>()
const fetchedRange = reactive<Range<Date>>({
  from: moment().subtract(21, 'days').startOf('week').toDate(),
  to: moment().add(21, 'days').endOf('week').toDate()
})
const calendarOptions = reactive<CalendarOptions>({
  selectable: true,
  plugins: [interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  firstDay: 1,
  slotMinTime: '09:00',
  slotMaxTime: '22:00',
  allDaySlot: false,
  height: 'auto',
  events: [],
  dayHeaderFormat: (arg) => {
    return moment(arg.date).format('ddd DD/MM')
  },
  select: (arg) => {
    selectedStartTime.value = arg.start
    selectedSchedule.value = undefined
    showLectureDialog.value = true
  },
  eventClick: (arg) => {
    selectedSchedule.value = arg.event.extendedProps.schedule
    selectedStartTime.value = undefined
    showLectureDialog.value = true
  },
  datesSet: (info) => {
    // current week not in fetched range => re-fetch
    if (info.start < fetchedRange.from || info.end > fetchedRange.to) {
      fetchedRange.from = moment(info.start).subtract(21, 'days').startOf('week').toDate()
      fetchedRange.to = moment(info.end).add(21, 'days').endOf('week').toDate()
      fetchSchedule(fetchedRange)
    }
  }
})

const getEventColorClass = (schedule: Schedule) => {
  const now = new Date()
  if (!schedule.lecture && now > new Date(schedule.endTime)) {
    return 'fc-warn'
  } else if (!schedule.lecture && now < new Date(schedule.startTime)) {
    return 'fc-upcoming'
  } else {
    return ''
  }
}

const fetchSchedule = async (range: Range<Date>) => {
  const schedule = await getSchedule(range)

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

onMounted(() => fetchSchedule(fetchedRange))
</script>

<template>
  <div class="toolbar">
    <BackButton />
  </div>
  <el-button v-if="isMobileView" class="btn__add" type="primary" :icon="IconNews"
    @click="openNewLectureDialog({ startTime: new Date() })">
    Add New Lecture
  </el-button>
  <FullCalendar ref="calendarRef" :options="calendarOptions"></FullCalendar>
  <LectureDialog v-if="showLectureDialog" v-model="showLectureDialog" :startTime="selectedStartTime"
    :schedule="selectedSchedule" @save="fetchSchedule(fetchedRange)" />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}

.btn__add {
  margin-bottom: 1.25rem;
  width: 100%;
}
</style>
<style>
.fc .fc-toolbar-title {
  font-size: 1.5em;
}

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
import { MOBILE_BREAKPOINT } from '@/configs/layout-config'
import { type Range } from '@/models/common'
import type { Schedule } from '@/models/schedule'
import { getSchedule } from '@/services/schedule-service'
import type { CalendarOptions } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { IconNews } from '@tabler/icons-vue'
import moment from 'moment'
import { onMounted, reactive, ref, watch } from 'vue'

const showLectureDialog = ref(false)
const selectedStartTime = ref<Date>()
const selectedSchedule = ref<Schedule>()
const fetchedRange = reactive<Range<Date>>({
  from: moment().subtract(21, 'days').startOf('week').toDate(),
  to: moment().add(21, 'days').endOf('week').toDate()
})
const isMobileView = ref<boolean>()
const calendarRef = ref<typeof FullCalendar>()
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
  titleFormat: { year: undefined, month: 'short', week: 'short', day: 'numeric' },
  dayHeaderFormat: (arg) => {
    return moment(arg.date).format('ddd DD/MM')
  },
  select: (arg) => {
    openNewLectureDialog({ startTime: arg.start })
  },
  eventClick: (arg) => {
    openNewLectureDialog({ schedule: arg.event.extendedProps.schedule })
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
  if (!schedule.lecture && now > new Date(schedule.startTime)) {
    return 'fc-warn'
  } else if (!schedule.lecture && now < new Date(schedule.startTime)) {
    return 'fc-upcoming'
  } else {
    return ''
  }
}

const openNewLectureDialog = ({ schedule, startTime }: { schedule?: Schedule, startTime?: Date }) => {
  selectedSchedule.value = schedule
  selectedStartTime.value = startTime
  showLectureDialog.value = true
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

watch(isMobileView, (mobile) => {
  calendarRef.value?.getApi().changeView(mobile ? 'timeGridDay' : 'timeGridWeek')
})

onMounted(() => {
  isMobileView.value = window.innerWidth < MOBILE_BREAKPOINT
  fetchSchedule(fetchedRange)
})

window.addEventListener('resize', () => {
  isMobileView.value = window.innerWidth < MOBILE_BREAKPOINT
})
</script>

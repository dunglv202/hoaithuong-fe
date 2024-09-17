<template>
  <div class="toolbar">
    <BackButton />
  </div>
  <el-button
    v-if="isMobileView"
    class="btn__add"
    type="primary"
    :icon="IconNews"
    @click="openNewLectureDialog({ startTime: new Date() })"
  >
    Add New Lecture
  </el-button>
  <div class="calendar-header">
    <h2 class="fc-toolbar-title">
      {{ moment(currentWeek.from).format('MMM DD') }}
      <span> - </span>
      {{ moment(currentWeek.to).subtract(1, 'days').format('DD') }}
    </h2>
    <div class="calendar-header__actions">
      <el-button :loading="syncing" :icon="IconRefresh" @click="syncToCalendar"> Sync </el-button>
      <el-button type="primary" @click="calendarRef?.getApi().today()"> Today </el-button>
      <el-button :icon="IconChevronLeft" @click="calendarRef?.getApi().prev()" />
      <el-button :icon="IconChevronRight" @click="calendarRef?.getApi().next()" />
    </div>
  </div>
  <FullCalendar ref="calendarRef" :options="calendarOptions"></FullCalendar>
  <LectureDialog
    v-if="showLectureDialog"
    v-model="showLectureDialog"
    :startTime="selectedStartTime"
    :schedule="selectedSchedule"
    @save="fetchSchedule(currentWeek)"
  />
</template>

<style scoped>
.toolbar {
  margin-bottom: 1rem;
}

.btn__add {
  margin-bottom: 1.25rem;
  width: 100%;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-header__actions {
  display: flex;
}

@media screen and (max-width: 768px) {
  .calendar-header {
    flex-direction: column-reverse;
    gap: 1rem;
  }
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
import type { MinimalSchedule, Schedule } from '@/models/schedule'
import { getSchedule, syncToGoogleCalendar } from '@/services/schedule-service'
import type { CalendarOptions } from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/vue3'
import { IconChevronLeft, IconChevronRight, IconNews, IconRefresh } from '@tabler/icons-vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { onMounted, reactive, ref, watch } from 'vue'

type FullCalendarComp = InstanceType<typeof FullCalendar>

const showLectureDialog = ref(false)
const selectedStartTime = ref<Date>()
const selectedSchedule = ref<Schedule>()
const currentWeek = reactive<Range<Date>>({
  from: moment().startOf('week').toDate(),
  to: moment().endOf('week').toDate()
})
const isMobileView = ref<boolean>()
const calendarRef = ref<FullCalendarComp>()
const calendarOptions = reactive<CalendarOptions>({
  selectable: true,
  plugins: [interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  firstDay: 1,
  slotMinTime: '08:00',
  slotMaxTime: '22:00',
  allDaySlot: false,
  height: 'auto',
  events: [],
  headerToolbar: false,
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
    if (info.start < currentWeek.from || info.end > currentWeek.to) {
      currentWeek.from = info.start
      currentWeek.to = info.end
    }
  }
})
const syncing = ref(false)

const getEventColorClass = (schedule: MinimalSchedule) => {
  const now = new Date()
  if (!schedule.lecture && now > new Date(schedule.startTime)) {
    return 'fc-warn'
  } else if (!schedule.lecture && now < new Date(schedule.startTime)) {
    return 'fc-upcoming'
  } else {
    return ''
  }
}

const openNewLectureDialog = ({
  schedule,
  startTime
}: {
  schedule?: Schedule
  startTime?: Date
}) => {
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

const syncToCalendar = async () => {
  try {
    syncing.value = true
    await syncToGoogleCalendar({
      from: moment().toDate()
    })
    ElMessage.success('Synced successfully')
  } finally {
    syncing.value = false
  }
}

watch(isMobileView, (mobile) => {
  calendarRef.value?.getApi().changeView(mobile ? 'timeGridDay' : 'timeGridWeek')
})

watch(currentWeek, (range) => {
  fetchSchedule(range)
})

onMounted(() => {
  isMobileView.value = window.innerWidth < MOBILE_BREAKPOINT
})

window.addEventListener('resize', () => {
  isMobileView.value = window.innerWidth < MOBILE_BREAKPOINT
})
</script>

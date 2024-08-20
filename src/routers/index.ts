import UserLayout from '@/layouts/UserLayout.vue'
import useAuthStore from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '',
        component: HomeView
      },
      {
        path: 'students',
        children: [
          {
            path: '',
            component: () => import('@/views/StudentsView.vue')
          },
          {
            path: ':id',
            component: () => import('@/views/HomeView.vue')
          }
        ]
      },
      {
        path: 'classes',
        component: () => import('@/views/TutorClassesView.vue')
      },
      {
        path: 'reports',
        component: () => import('@/views/ReportsView.vue')
      },
      {
        path: 'schedule',
        component: () => import('@/views/ScheduleView.vue')
      }
    ]
  },
  {
    path: '/signin',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()
  await authStore.initialize()
  if (to.path !== '/signin' && !authStore.isSignedIn) {
    next('/signin')
    return
  }
  if (to.path === '/signin' && authStore.isSignedIn) {
    next('/')
    return
  }
  next()
})

export default router

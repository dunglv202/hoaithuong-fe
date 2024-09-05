import useAuthStore from '@/stores/auth'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/HomeView.vue')
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
    path: '/profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/signin',
    component: () => import('@/views/LoginView.vue')
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

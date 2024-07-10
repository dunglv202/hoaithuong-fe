import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StudentsView from '@/views/StudentsView.vue'
import TutorClassesView from '@/views/TutorClassesView.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import ReportsView from '@/views/ReportsView.vue'
import useAuthStore from '@/stores/auth'

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
        component: StudentsView
      },
      {
        path: 'classes',
        component: TutorClassesView
      },
      {
        path: 'reports',
        component: ReportsView
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

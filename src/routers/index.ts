import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import StudentsView from '@/views/StudentsView.vue'
import TutorClassesView from '@/views/TutorClassesView.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import ReportsView from '@/views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
})

export default router

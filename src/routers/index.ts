import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudentsView from '../views/StudentsView.vue'
import TutorClassesView from '../views/TutorClassesView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomeView
    },
    {
      path: '/students',
      component: StudentsView
    },
    {
      path: '/classes',
      component: TutorClassesView
    },
    {
      path: '/signin',
      component: LoginView
    }
  ]
})

export default router

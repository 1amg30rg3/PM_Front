import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/IndexView.vue'
import DashView from './views/DashView.vue'
import ProductView from './views/ProductView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
        path: '/dashboard',
        component: DashView,
    },
    {
      path: '/product',
      component: ProductView,
  },
  ],
})

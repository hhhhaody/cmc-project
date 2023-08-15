import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Home1 from '../views/Home1.vue'
import Home2 from '../views/Home2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home1',
      component: Home1
    },
    {
      path: '/home',
      name: 'home',
      component: Home2
    },
    {
      path: '/inventory',
      name: 'inventory',
      // component: Inventory
      component: () => import('../views/Inventory.vue'),
    },
    {

      path: '/inventory/operation',
      component: () => import('../views/InventoryOperation.vue')

    },
    {
      path: '/production',
      name: 'production',
      component: () => import('../views/Production.vue')
    },
    {
      path: '/facility',
      name: 'facility',
      component: () => import('../views/Facility.vue')
    }, {
      path: '/security',
      name: 'security',
      component: () => import('../views/Security.vue')
    }, {
      path: '/capture',
      name: 'capture',
      component: () => import('../views/Capture.vue')
    }, {
      path: '/DeviceStatus',
      name: 'DeviceStatus',
      component: () => import('../views/DeviceStatus.vue')
    },



    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router

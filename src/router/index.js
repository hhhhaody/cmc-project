import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Home1 from '../views/Home1.vue'
import Home2 from '../views/Home2.vue'

export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

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
    }, {
      path: '/MaintenancePlan',
      name: 'MaintenancePlan',
      component: () => import('../views/MaintenancePlan.vue')
    }, {
      path: '/MaintenancePlan/MaintainList',
      component: () => import('../views/MaintainList.vue')
    }, {
      path: '/DeviceFiles',
      name: 'DeviceFiles',
      component: () => import('../views/DeviceFiles.vue')
    }, {
      path: '/Compose',
      name: 'compose',
      component: () => import('../views/Compose.vue')
    }, {
      path: '/TimeConsuming',
      name: 'TimeConsuming',
      component: () => import('../views/TimeConsuming.vue')
    }, {
      path: '/EnergyConsumption',
      name: 'EnergyConsumption',
      component: () => import('../views/EnergyConsumption.vue')
    }, {
      path: '/DefectiveMaterial',
      name: 'DefectiveMaterial',
      component: () => import('../views/DefectiveMaterial.vue')
    }, {
      path: '/ProductManagement',
      name: 'ProductManagement',
      component: () => import('../views/ProductManagement.vue')
    }, {
      path: '/MaintenanceRecords',
      name: 'MaintenanceRecords',
      component: () => import('../views/MaintenanceRecords.vue')
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

// router.beforeEach((to, from, next) => {
//   let pid = getQueryVariable('pid')
//   if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login', query: { pid: pid || '' } })
//   else next()
// })
//判断是否登录
function isAuthenticated() {
  let setToken = getQueryVariable('token') || '';
  if (setToken) {
    setToken = decodeURIComponent(setToken);
    sessionStorage.setItem("mobile_data_token", setToken);
  }
  const token = sessionStorage.getItem("mobile_data_token");
  if (token) {
    return true
  } else {
    return false
  }
}

export default router

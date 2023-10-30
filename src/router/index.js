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
    },
    {
      path: '/facility/status',
      name: 'facilityStatus',
      component: () => import('../views/FacilityStatus.vue')
    },
    {
      path: '/facility/detail',
      name: 'facilityDetail',
      component: () => import('../views/FacilityDetail.vue')
    },
    {
      path: '/security',
      name: 'security',
      component: () => import('../views/Security.vue')
    }, {
      path: '/capture',
      name: 'capture',
      component: () => import('../views/Capture.vue')
    }, {
      path: '/deviceStatus',
      name: 'deviceStatus',
      component: () => import('../views/DeviceStatus.vue')
    }, {
      path: '/maintenancePlan',
      name: 'maintenancePlan',
      component: () => import('../views/MaintenancePlan.vue')
    }, {
      path: '/maintenancePlan/maintainList',
      component: () => import('../views/MaintainList.vue')
    }, {
      path: '/deviceFiles',
      name: 'deviceFiles',
      component: () => import('../views/DeviceFiles.vue')
    }, {
      path: '/composition',
      name: 'composition',
      component: () => import('../views/Composition.vue')
    }, {
      path: '/timeConsumption',
      name: 'timeConsumption',
      component: () => import('../views/TimeConsumption.vue')
    },
    {
      path: '/energyConsumption',
      name: 'energyConsumption',
      component: () => import('../views/EnergyConsumption.vue')
    },
    {
      path: '/defectiveMaterial',
      name: 'defectiveMaterial',
      component: () => import('../views/DefectiveMaterial.vue')
    },
    {
      path: '/product',
      name: 'product',
      component: () => import('../views/Product.vue')
    },
    {

      path: '/product/operation',
      component: () => import('../views/ProductOperation.vue')

    },
    {
      path: '/maintenanceRecords',
      name: 'maintenanceRecords',
      component: () => import('../views/MaintenanceRecords.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    }, {
      path: '/folder-details/:folderId/:folderName',
      name: 'FolderDetails',
      component: () => import('../views/FolderDetails.vue')
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

router.beforeEach((to, from, next) => {
  // console.log("Router guard triggered");
  let pid = getQueryVariable('pid')
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login', query: { pid: pid || '' } })
  else next()
})
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
// console.log("Authenticated:", isAuthenticated());

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Home1 from '../views/Home1.vue'
import Home2 from '../views/Home2.vue'
import { jwtDecode } from 'jwt-decode';

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
      component: Home2
    },
    {
      path: '/home',
      name: 'home',
      component: Home1
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),

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
    },
    {
      path: '/maintenancePlan',
      name: 'maintenancePlan',
      component: () => import('../views/MaintenancePlan.vue')
    },
    {
      path: '/deviceMonitor',
      name: 'deviceMonitor',
      component: () => import('../views/DeviceMonitor.vue')
    },
    {
      path: '/maintenancePlan/maintenanceCalendar',
      component: () => import('../views/maintenanceCalendar.vue')
    }, {
      path: '/maintenancePlan/maintenanceList',
      component: () => import('../views/MaintenanceList.vue')
    },
    {
      path: '/maintenancePlan/detail',
      name: 'maintenancePlanDetail',
      component: () => import('../views/MaintenancePlanDetail.vue')
    },
    {
      path: '/maintenancePlan/daily',
      name: 'maintenancePlanDaily',
      component: () => import('../views/DailyMaintenance.vue')
    },
    {
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
      path: '/lowCarbon',
      name: 'lowCarbon',
      component: () => import('../views/LowCarbon.vue')
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
      path: '/troubleshooting',
      name: 'troubleshooting',
      component: () => import('../views/Troubleshooting.vue')
    },
    {
      path: '/quality',
      name: 'quality',
      component: () => import('../views/Quality.vue')
    },
    {
      path: '/troubleshooting/detail',
      name: 'troubleshootingDetail',
      component: () => import('../views/TroubleshootingDetail.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/folder-details/:folderId/:folderName',
      name: 'FolderDetails',
      component: () => import('../views/FolderDetails.vue')
    }, {
      path: '/UserManagement',
      name: 'UserManagement',
      component: () => import('../views/UserManagement.vue')
    }, {
      path: '/PersonalCenter',
      name: 'PersonalCenter',
      component: () => import('../views/PersonalCenter.vue')
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
  console.log("Router guard triggered");
  let pid = getQueryVariable('pid')
  if (to.name !== 'login' && !isAuthenticated()) next({ name: 'login', query: { pid: pid || '' } })
  else next()
  // next()
})

//判断是否登录
//isAuthenticated 函数检查存储的令牌是否存在，以及该令牌是否已过期。如果令牌不存在或已过期，函数返回 false，用户被重定向到登录页面。令牌有效，函数返回 true，继续导航。
function isAuthenticated() {
  let setToken = getQueryVariable('token') || '';
  if (setToken) {
    setToken = decodeURIComponent(setToken);
    sessionStorage.setItem("mobile_data_token", setToken);
  }

  const token = sessionStorage.getItem("mobile_data_token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // 令牌已过期
        return false;
      }
      return true;
    } catch (error) {
      console.error("JWT 解码错误:", error);
      return false;
    }
  } else {
    return false;
  }
}
// console.log("Authenticated:", isAuthenticated());

export default router

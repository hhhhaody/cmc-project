// src/store.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        adminType: '普通用户', // 默认为普通用户
        userRole: '普通用户', // 新增：用户角色，默认为 USER
    }),
    getters: {
        // 新增：getter 来判断用户是否为只读角色
        isReadOnly(state) {
            return state.userRole === '普通用户';
        }
    },
    actions: {
        setAdminType(type) {
            this.adminType = type;
            localStorage.setItem('adminType', type); // 同时更新本地存储
        },
        setUserRole(role) {
            // console.log("Updating user role to:", role);
            this.userRole = role;
            localStorage.setItem('userRole', role); // 新增：同时更新本地存储中的用户角色
        },
        initializeStore() {
            const adminType = localStorage.getItem('adminType');
            const userRole = localStorage.getItem('userRole'); // 新增：尝试从本地存储获取用户角色
            if (adminType) {
                this.adminType = adminType;
            }
            if (userRole) { // 新增：如果本地存储中有用户角色信息，则更新状态
                this.userRole = userRole;
            }
        }
    }
});

import httpInstance from "../utils/http";

// 登录API
export const loginUser = (username, password) => {
    return httpInstance({
        url: '/users/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

// 获取用户列表信息API
export const getUserInfoAPI = (page, pageSize, name, username, phone, adminType, status) => {
    return httpInstance({
        url: '/users/userInfo',
        params: {
            page,
            pageSize,
            name,
            username,
            phone,
            adminType,
            status
        }
    })
}

export const addUserInfoAPI = (data) => {
    return httpInstance({
        url: '/users/addUserInfo',
        method: 'post',
        data
    })
}

export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/users/' + id
    })
}

export const updateUserAPI = (data) => {
    return httpInstance({
        url: '/users/updateUser',
        method: 'put',
        data
    })
}

export const updateUserStatusAPI = (data) => {
    return httpInstance({
        url: '/users/updateUserStatus',
        method: 'put',
        data
    })
}

export const resetPasswordAPI = (userId) => {
    return httpInstance({
        url: `/users/${userId}/resetPassword`,
        method: 'put',
    });
}


export const deleteUserAPI = (id) => {
    return httpInstance({
        url: '/users/' + id,
        method: 'delete'
    })
}

export const updatePasswordAPI = (oldPassword, newPassword) => {
    return httpInstance({
        url: '/users/updatePassword',
        method: 'put',
        data: {
            oldPassword,
            newPassword,
        },
    });
};
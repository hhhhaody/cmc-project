import httpInstance from "../utils/http";

export const getDeviceAPI = () => {
    return httpInstance({
        url: '/data/state',
        method: 'get'
    })
}

export const setStatusAPI = (id) => {
    return httpInstance({
        url: '/data/state/' + id,
        method: 'put',
    })
}
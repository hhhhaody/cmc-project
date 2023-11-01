import httpInstance from "../utils/http";

export const getMaintenancePlanAPI = (page, pageSize, name, spec, section, status, maintenanceman, plannedTime) => {
    return httpInstance({
        url: '/maintenance',
        params: {
            page,
            pageSize,
            name,
            spec,
            section,
            status,
            maintenanceman,
            plannedTime
        }
    })
}

export const addMaintenancePlanAPI = (data) => {
    return httpInstance({
        url: '/maintenance',
        method: 'post',
        data
    })
}

export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/maintenance/' + id
    })
}

export const updateMaintenancePlanAPI = (data) => {
    return httpInstance({
        url: '/maintenance',
        method: 'put',
        data
    })
}

export const updateMaintenancePlanStatusAPI = (id) => {
    return httpInstance({
        url: '/maintenance/' + id,
        method: 'put'
    })
}
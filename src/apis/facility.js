import httpInstance from "../utils/http";

export const addFacilityAPI = (data) => {
    return httpInstance({
        url: '/facilities',
        method: 'post',
        data
    })
}


export const getFacilityAPI = (page, pageSize, name, spec, section, status, supplier) => {
    return httpInstance({
        url: '/facilities',
        params: {
            page,
            pageSize,
            name,
            spec,
            section,
            status,
            supplier
        }
    })
}


export const updateFacilityAPI = (data) => {
    return httpInstance({
        url: '/facilities',
        method: 'put',
        data
    })
}

export const updateFacilityStatusAPI = (id) => {
    return httpInstance({
        url: '/facilities/' + id,
        method: 'put'
    })
}

export const deleteFacilityAPI = (id) => {
    return httpInstance({
        url: '/facilities/' + id,
        method: 'delete'
    })
}


export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/facilities/' + id
    })
}

export const getFacilityStatusAPI = (page, pageSize, section, name, spec, updateTimeStart, updateTimeEnd, serialNo) => {
    return httpInstance({
        url: '/facilities/status',
        params: {
            page,
            pageSize,
            section,
            name,
            spec,
            updateTimeStart,
            updateTimeEnd,
            serialNo
        }
    })
}
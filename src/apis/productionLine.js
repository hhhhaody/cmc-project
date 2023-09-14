import httpInstance from "../utils/http";

export const getSectionsAPI = (page, pageSize) => {
    return httpInstance({
        url: '/productionLine',
        params: {
            page,
            pageSize
        }
    })
}

export const addSectionAPI = (data) => {
    return httpInstance({
        url: '/productionLine',
        method: 'post',
        data
    })
}

export const changeSectionNameAPI = (data) => {
    return httpInstance({
        url: '/productionLine/section',
        method: 'put',
        data
    })
}

export const deleteSectionAPI = (section) => {
    return httpInstance({
        url: '/productionLine/' + section,
        method: 'delete',
    })
}

export const getStationsAPI = (section) => {
    return httpInstance({
        url: '/productionLine/' + section,
    })
}

export const updateStationsAPI = (data) => {
    return httpInstance({
        url: '/productionLine',
        method: 'put',
        data
    })
}
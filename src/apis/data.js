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

export const getMaterialUsageAPI = (section) => {
    return httpInstance({
        url: 'data/material',
        method: 'get',
        params: {
            section
        }
    })
}

export const getProductAmountAPI = (section) => {
    return httpInstance({
        url: 'data/product',
        method: 'get',
        params: {
            section
        }
    })
}

export const getEnergyAPI = (section, date) => {
    return httpInstance({
        url: 'data/energy',
        method: 'get',
        params: {
            section,
            date,
        }
    })
}

export const getEnergyDatesAPI = (page, pageSize, section, dateStart, dateEnd) => {
    return httpInstance({
        url: '/data/energy/list',
        params: {
            page,
            pageSize,
            section,
            dateStart,
            dateEnd
        }
    })
}

export const getTimesAPI = (section) => {
    return httpInstance({
        url: 'data/timeConsumed',
        method: 'get',
        params: {
            section,
        }
    })
}

export const getMsgAPI = (date) => {
    return httpInstance({
        url: 'data/message',
        method: 'get',
        params: {
            date,
        }
    })
}

export const getMaterialInspectionAPI = (page, pageSize, name, dateStart, dateEnd) => {
    return httpInstance({
        url: '/data/materialInspection',
        params: {
            page,
            pageSize,
            name,
            dateStart,
            dateEnd
        }
    })
}
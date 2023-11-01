import httpInstance from "../utils/http";

export const getTroubleshootingRecordAPI = (page, pageSize, section, name, spec, completeTimeStart, completeTimeEnd, status, repairman) => {
    return httpInstance({
        url: '/troubleshooting',
        params: {
            page,
            pageSize,
            section,
            name,
            spec,
            completeTimeStart,
            completeTimeEnd,
            status,
            repairman
        }
    })
}

export const addTroubleshootingRecordAPI = (data) => {
    return httpInstance({
        url: '/troubleshooting',
        method: 'post',
        data
    })
}

export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/troubleshooting/' + id
    })
}

export const updateTroubleshootingRecordAPI = (data) => {
    return httpInstance({
        url: '/troubleshooting',
        method: 'put',
        data
    })
}
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

export const addTroubleshootingRecorAPI = (data) => {
    return httpInstance({
        url: '/troubleshooting',
        method: 'post',
        data
    })
}
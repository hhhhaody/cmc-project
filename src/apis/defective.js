import httpInstance from "../utils/http";

export const getDefectiveAPI = (page, pageSize, name, spec, supplier) => {
    return httpInstance({
        url: '/defectives',
        params: {
            page,
            pageSize,
            name,
            spec,
            supplier
        }
    })
}

export const getByBatchAPI = (batch) => {
    return httpInstance({
        url: '/defectives/' + encodeURIComponent(batch)
    })
}

export const addDefectiveOperationAPI = (data) => {
    return httpInstance({
        url: '/defectives/operation',
        method: 'post',
        data
    })
}

export const getDefectiveOperationListByBatchAPI = (batch) => {
    return httpInstance({
        url: '/defectives/operation/' + encodeURIComponent(batch)
    })
}
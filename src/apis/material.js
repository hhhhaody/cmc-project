import httpInstance from "../utils/http";

export const getMaterialAPI = (page, pageSize, name, spec) => {
    return httpInstance({
        url: '/materials',
        params: {
            page,
            pageSize,
            name,
            spec
        }
    })
}

export const addMaterialAPI = (data) => {
    return httpInstance({
        url: '/materials',
        method: 'post',
        data
    })
}

export const updateMaterialAPI = (data) => {
    return httpInstance({
        url: '/materials',
        method: 'put',
        data
    })
}

export const deleteMaterialAPI = (id) => {
    return httpInstance({
        url: '/materials/' + id,
        method: 'delete'
    })
}


export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/materials/' + id
    })
}


export const getMaterialOperationAPI = (page, pageSize, operation, name, spec, operateTimeStart, operateTimeEnd, supplier, operator) => {
    return httpInstance({
        url: '/materials/operation',
        params: {
            page,
            pageSize,
            operation,
            name,
            spec,
            operateTimeStart,
            operateTimeEnd,
            supplier,
            operator
        }
    })
}

export const addMaterialOperationAPI = (data) => {
    return httpInstance({
        url: '/materials/operation',
        method: 'post',
        data
    })
}

export const getByBatchAPI = (batch) => {
    return httpInstance({
        url: '/materials/operation/' + encodeURIComponent(batch)
    })
}

export const getMaterialOperationByIdAPI = (id) => {
    return httpInstance({
        url: '/materials/operation/id/' + id
    })
}

export const deleteMaterialOperationAPI = (id) => {
    return httpInstance({
        url: '/materials/operation/id/' + id,
        method: 'delete'
    })
}

export const updateMaterialOperationAPI = (data) => {
    return httpInstance({
        url: '/materials/operation',
        method: 'put',
        data
    })
}

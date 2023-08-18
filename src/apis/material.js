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

export const getSearchSuggestionAPI = (database, field) => {
    return httpInstance({
        url: '/' + database + '/search/' + field
    })
}

export const getDialogSearchSuggestionAPI = (database, field, data) => {
    return httpInstance({
        url: '/' + database + '/search/' + field,
        method: 'post',
        data
    })
}

export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/materials/' + id
    })
}


export const getMaterialOperationAPI = (page, pageSize, operation, name, spec, supplyTimeStart, supplyTimeEnd, supplier, operator) => {
    return httpInstance({
        url: '/materials/operation',
        params: {
            page,
            pageSize,
            operation,
            name,
            spec,
            supplyTimeStart,
            supplyTimeEnd,
            supplier,
            operator
        }
    })
}
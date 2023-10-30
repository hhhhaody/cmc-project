import httpInstance from "../utils/http";

export const getProductAPI = (page, pageSize, name, spec) => {
    return httpInstance({
        url: '/products',
        params: {
            page,
            pageSize,
            name,
            spec
        }
    })
}


export const addProductAPI = (data) => {
    return httpInstance({
        url: '/products',
        method: 'post',
        data
    })
}

export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/products/' + id
    })
}

export const deleteProductAPI = (id) => {
    return httpInstance({
        url: '/products/' + id,
        method: 'delete'
    })
}

export const updateProductAPI = (data) => {
    return httpInstance({
        url: '/products',
        method: 'put',
        data
    })
}

export const addProductOperationAPI = (data) => {
    return httpInstance({
        url: '/products/operation',
        method: 'post',
        data
    })
}

export const getProductOperationAPI = (page, pageSize, operation, name, spec, operateTimeStart, operateTimeEnd, quality, operator) => {
    return httpInstance({
        url: '/products/operation',
        params: {
            page,
            pageSize,
            operation,
            name,
            spec,
            operateTimeStart,
            operateTimeEnd,
            quality,
            operator
        }
    })
}

export const getByBatchAPI = (batch) => {
    return httpInstance({
        url: '/products/operation/' + encodeURIComponent(batch)
    })
}

export const getProductOperationByIdAPI = (id) => {
    return httpInstance({
        url: '/products/operation/id/' + id
    })
}

export const deleteProductOperationAPI = (id) => {
    return httpInstance({
        url: '/products/operation/id/' + id,
        method: 'delete'
    })
}

export const updateProductOperationAPI = (data) => {
    return httpInstance({
        url: '/products/operation',
        method: 'put',
        data
    })
}

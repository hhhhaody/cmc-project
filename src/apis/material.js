import httpInstance from "../utils/http";
// export function testAPI() {
//     return httpInstance({
//         url: '/depts'
//     })
// }

// export function getMaterialAPI() {
//     return httpInstance({
//         url: '/materials'
//     })
// }

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

export const getSearchSuggestionAPI = (field) => {
    return httpInstance({
        url: '/materials/search/' + field
    })
}

export const getByIdAPI = (id) => {
    return httpInstance({
        url: '/materials/' + id
    })
}


// export function getHotAPI() {
//     return httpInstance({
//         url: '/home/hot'
//     })
// }

// export const getGoodsAPI = () => {
//     return httpInstance({
//         url: '/home/goods'
//     })
// }
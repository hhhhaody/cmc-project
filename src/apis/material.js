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

export const getSearchSuggestionAPI = (field) => {
    return httpInstance({
        url: '/materials/' + field
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
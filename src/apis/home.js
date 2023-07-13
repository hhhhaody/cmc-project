import httpInstance from "../utils/http";
export function testAPI() {
    return httpInstance({
        url: '/depts'
    })
}

// export function getNewAPI() {
//     return httpInstance({
//         url: '/home/new'
//     })
// }

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
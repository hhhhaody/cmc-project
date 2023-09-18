import httpInstance from "../utils/http";

export const getVideoStreamAPI = (indexCode) => {
    return httpInstance({
        url: '/camera/videoStream',
        method: 'get',
        params: {
            indexCode: indexCode
        }
    })
}

export const updateVideoInfoAPI = () => {
    return httpInstance({
        url: '/camera/updateVideoInfo',
        method: 'get',
    })
}

import httpInstance from "../utils/http";

export const getCaptureAPI = (page, pageSize, captureTimeStart, captureTimeEnd) => {
    return httpInstance({
        url: '/capture',
        params: {
            page,
            pageSize,
            captureTimeStart,
            captureTimeEnd
        }
    })
}


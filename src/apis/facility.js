import httpInstance from "../utils/http";

export const addFacilityAPI = (data) => {
    return httpInstance({
        url: '/facilities',
        method: 'post',
        data
    })
}
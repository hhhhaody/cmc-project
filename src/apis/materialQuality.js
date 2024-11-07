import httpInstance from "../utils/http";

export const getMaterialQualityAPI = (page, pageSize, name, spec) => {
    return httpInstance({
        url: '/materialQuality',
        params: {
            page,
            pageSize,
            name,
            spec
        }
    })
}

export const addMaterialQualityAPI = (data) => {
    return httpInstance({
        url: '/materialQuality',
        method: 'post',
        data
    })
}
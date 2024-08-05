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
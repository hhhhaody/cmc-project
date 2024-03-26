import httpInstance from "../utils/http";

export const getCarbonAPI = (page, pageSize, type, section, startDate, endDate) => {
    return httpInstance({
        url: '/carbon',
        params: {
            page,
            pageSize,
            type,
            section,
            startDate,
            endDate
        }
    })
}
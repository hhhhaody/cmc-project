import httpInstance from "../utils/http";

// 获取能耗统计记录
export const getEnergyConsumptionRecordsAPI = (params) => {
    return httpInstance({
        url: '/energyConsumption/records',
        params: {
            page: params.page,
            pageSize: params.pageSize,
            sectionName: params.sectionName,
            startDate: params.startDate,
            endDate: params.endDate
        }
    });
}


// 添加能耗统计记录
export const addEnergyConsumptionRecordAPI = (data) => {
    return httpInstance({
        url: '/energyConsumption/record',
        method: 'post',
        data
    })
}

// 更新能耗统计记录
export const updateEnergyConsumptionRecordAPI = (data) => {
    return httpInstance({
        url: '/energyConsumption/record',
        method: 'put',
        data
    })
}

// 删除能耗统计记录
export const deleteEnergyConsumptionRecordAPI = (id) => {
    return httpInstance({
        url: '/energyConsumption/record/' + id,
        method: 'delete'
    })
}

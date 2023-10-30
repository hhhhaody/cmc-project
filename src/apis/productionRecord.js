import httpInstance from "../utils/http";

/**
 * 根据给定的参数获取生产记录。
 *
 * @param {number} page - 当前页码。
 * @param {number} pageSize - 每页的项目数量。
 * @param {string} name - 产品的名称。
 * @param {string} spec - 产品的规格。
 * @param {number} productionQuantity - 产品的生产数量。
 * @param {string} startDate - 开始日期。
 * @param {string} endDate - 结束日期。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const getProductionRecordAPI = (page, pageSize, name, spec, productionQuantity, startDate, endDate) => {
    return httpInstance({
        url: '/productionRecord',
        params: {
            page,
            pageSize,
            name,
            spec,
            productionQuantity,
            startDate,
            endDate
        }
    })
}
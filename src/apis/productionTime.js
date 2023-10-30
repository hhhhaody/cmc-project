import httpInstance from "../utils/http";

/**
 * 根据给定的参数获取生产时间信息。
 *
 * @param {number} page - 当前页码。
 * @param {number} pageSize - 每页的项目数量。
 * @param {string} itemCode - 产品的编码。
 * @param {string} itemName - 产品的名称。
 * @param {string} itemModel - 产品的模型或规格。
 * @param {string} section - 生产部分或生产线名称。
 * @param {string} startDate - 开始日期。
 * @param {string} endDate - 结束日期。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const getProductionTimeAPI = (page, pageSize, itemCode, itemName, itemModel, section, startDate, endDate) => {
    return httpInstance({
        url: '/productionTime',
        params: {
            page,
            pageSize,
            itemCode,
            itemName,
            itemModel,
            section,
            startDate,
            endDate
        }
    })
}
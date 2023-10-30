import httpInstance from "../utils/http";

/**
 * 根据给定的关键字、页码和每页大小获取所有文件夹。
 *
 * @param {number} page - 当前页码。
 * @param {number} pageSize - 每页的项目数量。
 * @param {string} keyword - 可选的搜索关键字。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const getAllFolderAPI = (page, pageSize, keyword) => {
    return httpInstance({
        url: '/deviceFiles/getAllFolder',
        method: 'GET',
        params: {
            page: page,
            pageSize: pageSize,
            keyword: keyword // 可选的，只在用户进行搜索时发送
        }
    });
};

/**
 * 在指定的文件夹中获取所有与给定关键字匹配的文件。
 *
 * @param {number} folderId - 要搜索的文件夹的ID。
 * @param {number} page - 当前页码。
 * @param {number} pageSize - 每页的项目数量。
 * @param {string} keyword - 可选的搜索关键字。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const getAllFilesInFolderAPI = (folderId, page, pageSize, keyword) => {
    return httpInstance({
        url: '/deviceFiles/getAllFilesInFolder',
        method: 'GET',
        params: {
            folderId: folderId,
            page: page,
            pageSize: pageSize,
            keyword: keyword // 可选的，只在用户进行搜索时发送
        }
    });
};

/**
 * 创建一个新的文件夹。
 *
 * @param {string} folderName - 新文件夹的名称。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const createFolderAPI = (folderName) => {
    return httpInstance({
        url: '/deviceFiles/createFolder',
        method: 'POST',
        data: {
            name: folderName
        }
    });
};

/**
 * 上传文件到指定的文件夹。
 *
 * @param {File} selectedFile - 要上传的文件。
 * @param {number} folderId - 文件夹ID。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const uploadFileAPI = (selectedFile, folderId) => {
    const formData = new FormData();
    formData.append('file', selectedFile);  // 这里是文件内容
    formData.append('fileName', selectedFile.name);  // 文件名
    formData.append('fileSize', selectedFile.size);  // 文件大小
    formData.append('folderId', folderId);  // 文件夹ID

    return httpInstance({
        url: '/deviceFiles/uploadFile',
        method: 'POST',
        data: formData
    });
};

/**
 * 重命名指定的项目（文件或文件夹）。
 *
 * @param {number} itemId - 要重命名的项目的ID。
 * @param {string} newName - 新的项目名称。
 * @param {string} itemType - 项目类型（"FILE"或"FOLDER"）。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const renameItemAPI = (itemId, newName, itemType) => {
    if (!itemType) {
        throw new Error("itemType is required and cannot be null or empty");
    }
    return httpInstance({
        url: `/deviceFiles/renameItem/${itemId}`,
        method: 'PUT',
        data: {
            newName: newName,
            itemType: itemType
        }
    });
};

/**
 * 删除指定的项目（文件或文件夹）。
 *
 * @param {number} itemId - 要删除的项目的ID。
 * @param {string} itemType - 项目类型（"FILE"或"FOLDER"）。
 * @returns {Promise} - 代表HTTP响应的Promise对象。
 */
export const deleteItemAPI = (itemId, itemType) => {
    if (!itemId || !itemType) {
        throw new Error("Both itemId and itemType are required and cannot be null or empty");
    }
    return httpInstance({
        url: `/deviceFiles/deleteItem/${itemId}`,
        method: 'DELETE',
        params: {
            itemType: itemType
        }
    });
};



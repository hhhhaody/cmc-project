import httpInstance from "../utils/http";

export const getStsAPI = () => {
    return httpInstance({
        url: '/ecloud',
    })
}

// 列表搜索api

export const getSearchSuggestionAPI = (database, field) => {
    return httpInstance({
        url: '/' + database + '/search/' + field
    })
}

// 弹框内搜索api
export const getDialogSearchSuggestionAPI = (database, field, data) => {
    return httpInstance({
        url: '/' + database + '/search/' + field,
        method: 'post',
        data
    })
}

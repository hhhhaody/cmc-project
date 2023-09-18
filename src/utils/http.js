//axios encapsulation
import axios from "axios";
import { ElNotification } from "element-plus";

const _axiosPromiseArr = []

const httpInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    withCredentials: true
})

//interceptor
httpInstance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.cancelToken = new axios.CancelToken(cancel => {
        _axiosPromiseArr.push({ cancel })
    })
    const token = sessionStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log(config);
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    ElNotification({
        title: '失败',
        message: '请重试或联系管理员',
        duration: 2000,
        type: "error"
    })
    return Promise.reject(error);
});

// 添加响应拦截器
httpInstance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code === 500) {
        // 清除当前所有的未得到结果的异步请求
        _axiosPromiseArr.forEach((element, index) => {
            element.cancel()
            delete _axiosPromiseArr[index]
        });
        localStorage.clear();
        return false;
    }
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response.status === 500) {
        ElNotification({
            title: '失败',
            message: '连接数据库失败，请联系管理员',
            duration: 2000,
            type: "error"
        })
    }
    else {
        ElNotification({
            title: '失败',
            message: '操作失败请重试',
            duration: 2000,
            type: "error"
        })
    }
    return Promise.reject(error);
});


export default httpInstance
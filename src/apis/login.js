import httpInstance from "../utils/http";
// 基础URL配置，这取决于你的后端服务地址
// const baseURL = 'http://10.200.20.17:8081';

// // 创建一个axios实例
// const apiClient = axios.create({
//     baseURL: baseURL,
//     timeout: 10000,  // 请求超时时间限制
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// apiClient.interceptors.request.use((config) => {
//     const token = sessionStorage.getItem("jwtToken");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });


// 登录API
export const loginUser = async (username, password) => {
    try {
        const res = await httpInstance.post('/login', {
            username,
            password,
        });

        // console.log(res);
        const token = res;
        // console.log(token);
        if (token) {
            sessionStorage.setItem("jwtToken", token);
            return res;
        } else {
            console.error("No token received");
            throw new Error("No token received");  // 抛出错误以便调用者可以捕获
        }
    } catch (error) {
        console.error(error);
        throw error;  // 抛出错误以便调用者可以捕获
    }
};


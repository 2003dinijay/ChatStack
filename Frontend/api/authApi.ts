import axios from "axios";
import Cookies from "js-cookie";

const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default authApi;
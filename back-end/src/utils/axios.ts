import axios from 'axios';

axios.interceptors.request.use(async config => {
    return config;
});

axios.interceptors.response.use(response => {
    return response;
}, (error) => {
    return Promise.reject(error.response);
})

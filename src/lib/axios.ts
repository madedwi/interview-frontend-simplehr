import Axios from 'axios'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export const requestCsrf = async () => {
    const res = await axios.get('/sanctum/csrf-cookie');
    const data = await res.data;
    return data;
};

export default axios
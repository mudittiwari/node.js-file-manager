import axios from 'axios';
import { toast } from 'react-hot-toast';
async function makeRequest(url, headers = {}, method = 'GET', data = null, queryParams = {}) {
    try {
        const options = {
            method: method.toUpperCase(),
            url: url,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            params: queryParams,
        };
        if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && data) {
            options.data = data;
        }
        const response = await axios(options);
        return response;

    } catch (error) {
        // console.error('An error occurred:', error);
        return error;
    }
}

const notifySuccess = (message) => {
    toast.success(message, {
        iconTheme: {
            primary: '#67539f'
        },
    });
};

const notifyError = (message) => {
    toast.error(message, {
        iconTheme: {
            primary: 'red'
        },
    });
};

export {makeRequest, notifySuccess, notifyError}
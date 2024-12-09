import axios from 'axios';
import { toast } from 'react-hot-toast';
async function makeRequest(url, headers = {}, method = 'GET', data = null, queryParams = {}, responseType = null) {
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
        if(responseType)
            options.responseType = responseType
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
            primary: '#1F2937'
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
const compareArrays = (array1, array2) => {
    const array2Sorted = array2.slice().sort();
    return array1.length === array2.length && array1.slice().sort().every(function (value, index) {
        return value === array2Sorted[index];
    });
}
const removeItemFromArray = (array, itemToRemove) => {
    const newArray = array
        .filter(item => item !== itemToRemove);
    return newArray;
}

export { makeRequest, notifySuccess, notifyError, compareArrays, removeItemFromArray }
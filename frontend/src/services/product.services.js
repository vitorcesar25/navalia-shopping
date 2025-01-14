import apiClient from "../plugins/axios";

const BASE_PATH = "/products";

const getProducts = async (limit = 10, startAfter = null) => {
    let url = `${BASE_PATH}?limit=${limit}`;
    if (startAfter) {
        url += `&startAfter=${startAfter}`;
    }
    const response = await apiClient.get(url);
    return response.data;
};

export default {
    getProducts
}
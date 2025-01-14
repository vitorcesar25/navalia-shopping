import apiClient from "../plugins/axios";

const BASE_PATH = "/carts";

const getCartByUserId = async (limit = 10, startAfter = null) => {
    const response = await apiClient.get(BASE_PATH);
    return response.data;
};

const clearCartByUserId = async () => {
    const response = await apiClient.delete(BASE_PATH);
    return response.data;
}

const updateCartItem = async (productId, quantity) => {
    const response = await apiClient.patch(`${BASE_PATH}/items`, { productId, quantity });
    return response.data;
}

export default {
    getCartByUserId,
    clearCartByUserId,
    updateCartItem
}
import apiClient from "../plugins/axios";

const BASE_PATH = "/promotions";

const calculatePromotions = async (cartItems) => {
    const response = await apiClient.post(`${BASE_PATH}/calculate`, { cartItems });
    return response.data;
}

export default {
    calculatePromotions
}
import apiClient from "./axios";
import type { Order } from "../types";

export const ordersApi = {
    createOrder: (order: Omit<Order, "id">) => apiClient.post<Order>("/orders", order).then((res) => res.data),
};

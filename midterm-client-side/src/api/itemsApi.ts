import apiClient from "./axios";
import type { Item } from "../types";

export const itemsApi = {
    getItems: () => apiClient.get<Item[]>("/items").then((res) => res.data),
    getItem: (id: string) => apiClient.get<Item>(`/items/${id}`).then((res) => res.data),
    createItem: (item: Omit<Item, "id">) => apiClient.post<Item>("/items", item).then((res) => res.data),
    updateItem: (id: string, item: Partial<Item>) => apiClient.put<Item>(`/items/${id}`, item).then((res) => res.data),
    deleteItem: (id: string) => apiClient.delete(`/items/${id}`),
};

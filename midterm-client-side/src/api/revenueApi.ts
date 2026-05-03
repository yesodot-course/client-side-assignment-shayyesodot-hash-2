import apiClient from "./axios";
import type { Item, Supplier } from "../types";

export const revenueApi = {
    getMonthlyRevenue: () => apiClient.get<number>("/revenue/monthly").then((res) => res.data),
    getWeeklyProfitableCategory: () => apiClient.get<string>("/revenue/weekly-category").then((res) => res.data),
    getDailyProfitableItem: () => apiClient.get<Item>("/revenue/daily-item").then((res) => res.data),
    getProfitMargins: () =>
        apiClient.get<{ highest: Item; lowest: Item }>("/revenue/profit-margins").then((res) => res.data),
    getMostProfitableSupplier: () =>
        apiClient.get<Supplier>("/revenue/most-profitable-supplier").then((res) => res.data),
    getSupplierSpending: () =>
        apiClient.get<{ supplierName: string; amount: number }[]>("/revenue/supplier-spending").then((res) => res.data),
};

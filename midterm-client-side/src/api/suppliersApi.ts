import apiClient from "./axios";
import type { Supplier } from "../types";

export const suppliersApi = {
    getSuppliers: () => apiClient.get<Supplier[]>("/suppliers").then((res) => res.data),
    createSupplier: (supplier: Omit<Supplier, "id">) =>
        apiClient.post<Supplier>("/suppliers", supplier).then((res) => res.data),
    updateSupplier: (id: string, supplier: Partial<Supplier>) =>
        apiClient.put<Supplier>(`/suppliers/${id}`, supplier).then((res) => res.data),
    deleteSupplier: (id: string) => apiClient.delete(`/suppliers/${id}`),
};

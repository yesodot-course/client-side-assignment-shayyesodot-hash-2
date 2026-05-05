export interface SupplierItem {
    name: string;
    price: number;
}

export interface Supplier {
    id: string;
    name: string;
    items: SupplierItem[];
}

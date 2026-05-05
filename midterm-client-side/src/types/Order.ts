export interface OrderItem {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    address: string;
    orderDate: string;
    shopProfit: number;
}

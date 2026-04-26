export interface Item {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  supplier: string; // Supplier name or ID
  image: string;
  description: string;
}

export interface SupplierItem {
  name: string;
  price: number;
}

export interface Supplier {
  id: string;
  name: string;
  items: SupplierItem[];
}

export interface OrderItem {
  productId: string;
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

export interface Analytics {
  totalProducts: number;
  lowStockItems: Item[];
  monthlyRevenue: number;
  weeklyProfitableCategory: string;
  dailyProfitableItem: Item;
  highestProfitMarginItem: Item;
  lowestProfitMarginItem: Item;
  mostProfitableSupplier: Supplier;
  supplierSpending: { supplierName: string; amount: number }[];
}

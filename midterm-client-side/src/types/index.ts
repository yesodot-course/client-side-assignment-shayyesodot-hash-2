export * from "./Item";
export * from "./Order";
export * from "./Supplier";

export interface Analytics {
    totalProducts: number;
    lowStockItems: import("./Item").Item[];
    monthlyRevenue: number;
    weeklyProfitableCategory: string;
    dailyProfitableItem: import("./Item").Item;
    highestProfitMarginItem: import("./Item").Item;
    lowestProfitMarginItem: import("./Item").Item;
    mostProfitableSupplier: import("./Supplier").Supplier;
    supplierSpending: { supplierName: string; amount: number }[];
}

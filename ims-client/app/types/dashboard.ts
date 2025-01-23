export interface DashboardStats {
    lowStockItemsCount: number;
    nearExpiryItemsCount: number;
    amountSoldToday: number;
    lowStockItems: LowStockItem[];
    nearExpiryItems: NearExpiryItem[];
}

export interface LowStockItem {
    id: number;
    productName: string;
    currentStock: number;
}

export interface NearExpiryItem {
    id: number;
    productName: string;
    expiryDate: string;
    category: string;
}
export interface Item {
    id: number;           // Previously ItemID
    name: string;         // Previously ItemName
    unit: string;
    description: string;
    price: number;
    createdAt: string;    // ISO 8601 string, e.g., "2023-10-05T14:48:00.000Z"
    userId: number;       // Previously UserId
}

// Interface representing a stock entry from the backend
export interface Stock {
    stockId: number;      // Previously StockID
    itemId: number;       // Previously ItemID
    quantity: number;
    arrivalDate: string;  // ISO 8601 string
    expiryDate?: string | null; // Optional ISO 8601 string
    location?: string;    // Optional location field
    updatedAt: string;    // ISO 8601 string
}

// Interface for frontend representation of a stock item
export interface StockItem {
    id: number;           // Mapped from stock.stockId
    itemId: number;       // Mapped from stock.itemId
    quantity: number;
    arrivalDate: string;
    expiryDate?: string;
    updatedAt: string;
}

// Generic interface for API responses
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

// Interface for paginated data
export interface PaginatedData<T> {
    items: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

// Interface for error handling
export interface ApiError {
    statusCode: number;
    message: string;
}

// Request payload for creating or updating an item
export interface ItemPayload {
    ItemName: string;
    Unit: string;
    Description: string;
    Price: number;
    UserId?: number; // Optional when creating a new item
}

// Request payload for creating or updating stock
export interface StockPayload {
    ItemID?: number; // Optional when updating existing stock
    Quantity: number;
    ArrivalDate: string;
    ExpiryDate?: string | null;
    Location?: string;
}

// Type for sorting configuration
export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
    key: keyof T;
    direction: SortDirection;
}

// Interface for search filters
export interface SearchFilter {
    query: string;
}

// Interface for pagination parameters
export interface PaginationParams {
    page: number;
    limit: number;
}

// Union type for possible Item operations
export type ItemOperation = 'CREATE' | 'UPDATE' | 'DELETE';

// Union type for possible Stock operations
export type StockOperation = 'CREATE' | 'UPDATE' | 'DELETE';
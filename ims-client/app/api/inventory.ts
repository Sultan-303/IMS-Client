import axios, { AxiosResponse } from 'axios';
import {
    Item,
    ItemPayload,
    Stock,
    StockPayload,
    ApiResponse,
    PaginatedData,
    PaginationParams,
} from '../types/inventory';

// Replace with your actual backend base URL
const API_BASE_URL = 'https://localhost:5079/api';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Optionally, you can set up interceptors here for authentication tokens
});

/**
 * Helper function to handle responses
 * Ensures that only successful responses are returned.
 * Throws an error if the response indicates failure.
 *
 * @param response - The Axios response object
 * @returns The data from the response
 * @throws Error with the provided message or a default message
 */
const handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    if (response.data.success) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'API Error');
    }
};

/**
 * Helper function to handle errors
 * Processes and throws meaningful error messages.
 *
 * @param error - The error object caught in the catch block
 * @throws Error with a relevant message
 */
const handleError = (error: any): never => {
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else if (error.message) {
            throw new Error(error.message);
        }
    }
    throw new Error('An unknown error occurred.');
};

/** 
 * =========================
 * Items API Functions
 * =========================
 */

/**
 * Fetch paginated items
 * @param params Pagination parameters
 * @returns Paginated list of items
 */
export const getItems = async (params: PaginationParams): Promise<PaginatedData<Item> | undefined> => {
    try {
        const response = await axiosInstance.get<ApiResponse<PaginatedData<Item>>>('/items', {
            params: {
                page: params.page,
                limit: params.limit,
            },
        });
        return handleResponse<PaginatedData<Item>>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Fetch a single item by ID
 * @param itemId Item ID
 * @returns The requested item
 */
export const getItemById = async (itemId: number): Promise<Item | undefined> => {
    try {
        const response = await axiosInstance.get<ApiResponse<Item>>(`/items/${itemId}`);
        return handleResponse<Item>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Create a new item
 * @param payload Item data
 * @returns The created item
 */
export const createItem = async (payload: ItemPayload): Promise<Item | undefined> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Item>>('/items', payload);
        return handleResponse<Item>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Update an existing item
 * @param itemId Item ID
 * @param payload Updated item data
 * @returns The updated item
 */
export const updateItem = async (itemId: number, payload: ItemPayload): Promise<Item | undefined> => {
    try {
        const response = await axiosInstance.put<ApiResponse<Item>>(`/items/${itemId}`, payload);
        return handleResponse<Item>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Delete an item
 * @param itemId Item ID
 * @returns Success status
 */
export const deleteItem = async (itemId: number): Promise<null | undefined> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/items/${itemId}`);
        return handleResponse<null>(response);
    } catch (error) {
        handleError(error);
    }
};

/** 
 * =========================
 * Stocks API Functions
 * =========================
 */

/**
 * Fetch paginated stocks for a specific item
 * @param itemId Item ID
 * @param params Pagination parameters
 * @returns Paginated list of stocks
 */
export const getStocksByItem = async (
    itemId: number,
    params: PaginationParams
): Promise<PaginatedData<Stock> | undefined> => {
    try {
        const response = await axiosInstance.get<ApiResponse<PaginatedData<Stock>>>(`/stocks/item/${itemId}`, {
            params: {
                page: params.page,
                limit: params.limit,
            },
        });
        return handleResponse<PaginatedData<Stock>>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Create a new stock entry
 * @param payload Stock data
 * @returns The created stock entry
 */
export const createStock = async (payload: StockPayload): Promise<Stock | undefined> => {
    try {
        const response = await axiosInstance.post<ApiResponse<Stock>>('/stocks', payload);
        return handleResponse<Stock>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Update an existing stock entry
 * @param stockId Stock ID
 * @param payload Updated stock data
 * @returns The updated stock entry
 */
export const updateStock = async (stockId: number, payload: StockPayload): Promise<Stock | undefined> => {
    try {
        const response = await axiosInstance.put<ApiResponse<Stock>>(`/stocks/${stockId}`, payload);
        return handleResponse<Stock>(response);
    } catch (error) {
        handleError(error);
    }
};

/**
 * Delete a stock entry
 * @param stockId Stock ID
 * @returns Success status
 */
export const deleteStock = async (stockId: number): Promise<null | undefined> => {
    try {
        const response = await axiosInstance.delete<ApiResponse<null>>(`/stocks/${stockId}`);
        return handleResponse<null>(response);
    } catch (error) {
        handleError(error);
    }
};
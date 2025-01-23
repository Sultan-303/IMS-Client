'use client';

import React, { useState, useEffect } from 'react';
import { Item, StockItem } from '../../../types/inventory'; // Adjust the import path as necessary

interface AddStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newStockItem: Omit<StockItem, 'id' | 'updatedAt'>) => void;
    items: Item[];
}

export const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onAdd, items }) => {
    console.log('AddStockModal received items:', items); 
    const [itemId, setItemId] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [arrivalDate, setArrivalDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
    const [expiryDate, setExpiryDate] = useState<string>('');

    // Update itemId whenever items change
    useEffect(() => {
        if (items.length > 0) {
            setItemId(items[0].id); // Use ItemID from types/inventory.ts
        }
    }, [items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formattedExpiryDate = expiryDate.trim() === '' ? undefined : expiryDate;
        onAdd({ 
            itemId, 
            quantity, 
            arrivalDate, 
            expiryDate: formattedExpiryDate 
        });
        // Reset form fields
        if (items.length > 0) {
            setItemId(items[0].id); // Reset to first item's ItemID
        } else {
            setItemId(0);
        }
        setQuantity(0);
        setArrivalDate(new Date().toISOString().split('T')[0]); // Reset to today
        setExpiryDate('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-black mb-4">Add New Stock Item</h3>
                            <div className="mb-4">
                                <label htmlFor="itemId" className="block text-sm font-medium text-black">Item</label>
                                <select
                                    id="itemId"
                                    required
                                    value={itemId}
                                    onChange={(e) => setItemId(Number(e.target.value))}
                                    data-testid="add-stock-itemId"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                >
                                    {items && items.length > 0 ? (
                                        items
                                            .filter(item => item.id !== undefined && item.id !== null)
                                            .map((item) => (
                                                <option key={`item-${item.id}`} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))
                                    ) : (
                                        <option key="no-items" value="">
                                            No items available
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-black">Quantity</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    required
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    data-testid="add-stock-quantity"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="arrivalDate" className="block text-sm font-medium text-black">Arrival Date</label>
                                <input
                                    id="arrivalDate"
                                    type="date"
                                    required
                                    value={arrivalDate}
                                    onChange={(e) => setArrivalDate(e.target.value)}
                                    data-testid="add-stock-arrivalDate"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-black">Expiry Date (Optional)</label>
                                <input
                                    id="expiryDate"
                                    type="date"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    data-testid="add-stock-expiryDate"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
                                />
                            </div>
                        </div>
                        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                data-testid="submit-add-stock"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                data-testid="close-add-stock-modal"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-black hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
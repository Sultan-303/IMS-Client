'use client';

import React, { useState, useEffect } from 'react';
import { StockItem } from '../../../types/inventory'; // Adjust the path as necessary

interface EditStockModalProps {
    isOpen: boolean;
    stockItem: StockItem | null;
    onClose: () => void;
    onSave: (updatedStockItem: StockItem) => void;
}

export const EditStockModal: React.FC<EditStockModalProps> = ({ isOpen, stockItem, onClose, onSave }) => {
    const [itemId, setItemId] = useState<number>(stockItem?.itemId || 0);
    const [quantity, setQuantity] = useState<number>(stockItem?.quantity || 0);
    const [location, setLocation] = useState<string>(stockItem?.location || '');

    useEffect(() => {
        if (stockItem) {
            setItemId(stockItem.itemId);
            setQuantity(stockItem.quantity);
            setLocation(stockItem.location);
        } else {
            // Reset fields when no stock item is selected
            setItemId(0);
            setQuantity(0);
            setLocation('');
        }
    }, [stockItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (stockItem) {
            onSave({
                ...stockItem,
                itemId,
                quantity,
                location,
                updatedAt: new Date().toISOString(),
            });
        }
        onClose();
    };

    if (!isOpen || !stockItem) return null;

    return (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Stock Item</h3>
                            <div className="mb-4">
                                <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">Item ID</label>
                                <input
                                    id="itemId"
                                    type="number"
                                    required
                                    value={itemId}
                                    onChange={(e) => setItemId(Number(e.target.value))}
                                    data-testid="edit-stock-itemId"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    required
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    data-testid="edit-stock-quantity"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    data-testid="edit-stock-location"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                        </div>
                        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                data-testid="submit-edit-stock"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                data-testid="close-edit-stock-modal"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
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
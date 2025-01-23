'use client';

import React, { useState, useEffect } from 'react';
import { AddStockModal } from '../components/AddStockModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { EditStockModal } from '../components/EditStockModal';
import { Item, StockItem } from '../../../types/inventory';

export default function StockPage() {
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
    const [stockItemToDelete, setStockItemToDelete] = useState<StockItem | null>(null);

    useEffect(() => {
        fetchStockItems();
        fetchItems();
    }, []);

    const fetchStockItems = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5079/api/Inventory/user-stocks', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch stock items.');
            }
            const data = await response.json();

            const mappedData: StockItem[] = data.map((stock: any, index: number) => ({
                id: stock.StockID || stock.stockID || index, 
                itemId: stock.ItemID || stock.itemID || stock.itemId, 
                quantity: stock.Quantity || stock.quantity,
                arrivalDate: stock.ArrivalDate || stock.arrivalDate || '',
                expiryDate: stock.ExpiryDate || stock.expiryDate || null,
                updatedAt: stock.UpdatedAt || stock.updatedAt || '',
            }));

            console.log('Mapped Stock Items:', mappedData);
            setStockItems(mappedData);
            console.log('Fetched Stock Items:', mappedData);
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'An error occurred while fetching stock items.');
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async () => {
        setLoadingItems(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5079/api/Inventory/items', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch items.');
            }
            const data: Item[] = await response.json();
            console.log('Fetched Items:', data);
            setItems(data);
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'An error occurred while fetching items.');
        } finally {
            setLoadingItems(false);
        }
    };

    const getItemName = (itemId: number) => {
        const item = items.find((item) => item.id === itemId);
        return item ? item.name : 'Unknown';
    };

    const handleEdit = (stockItem: StockItem) => {
        setSelectedStockItem(stockItem);
        setIsEditModalOpen(true);
    };

    const handleDelete = (stockItem: StockItem) => {
        setStockItemToDelete(stockItem);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async (updatedStockItem: StockItem) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5079/api/Inventory/stocks/${updatedStockItem.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stockId: updatedStockItem.id,
                    itemId: updatedStockItem.itemId,
                    quantity: updatedStockItem.quantity,
                    arrivalDate: updatedStockItem.arrivalDate,
                    expiryDate: updatedStockItem.expiryDate,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock item');
            }

            const updatedItems = stockItems.map(item => 
                item.id === updatedStockItem.id ? updatedStockItem : item
            );

            setStockItems(updatedItems);
            console.log('Updated Stock Items:', updatedItems);

            setIsEditModalOpen(false);
            setSelectedStockItem(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleConfirmDelete = async () => {
        if (!stockItemToDelete) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5079/api/Inventory/stocks/${stockItemToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete stock item');
            }

            setStockItems(stockItems.filter(item => item.id !== stockItemToDelete.id));
            setIsDeleteModalOpen(false);
            setStockItemToDelete(null);
            console.log('Deleted Stock Item:', stockItemToDelete.id); 
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleAddStockItem = () => {
        setIsAddModalOpen(true);
    };

    const handleCreate = async (newStockItem: Omit<StockItem, 'id' | 'updatedAt'>) => {
        console.log('Received new stock item from modal:', newStockItem); 
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5079/api/Inventory/stocks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: newStockItem.itemId,
                    quantity: newStockItem.quantity,
                    arrivalDate: newStockItem.arrivalDate,
                    expiryDate: newStockItem.expiryDate,
                    location: null, 
                    updatedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add stock item');
            }

            const createdStockItemRaw: any = await response.json();
            console.log('Created Stock Item Raw:', createdStockItemRaw); 

      
            const createdStockItem: StockItem = {
                id: createdStockItemRaw.StockID || createdStockItemRaw.stockID || Math.random(),
                itemId: createdStockItemRaw.ItemID || createdStockItemRaw.itemID || createdStockItemRaw.itemId,
                quantity: createdStockItemRaw.Quantity || createdStockItemRaw.quantity,
                arrivalDate: createdStockItemRaw.ArrivalDate || createdStockItemRaw.arrivalDate || '',
                expiryDate: createdStockItemRaw.ExpiryDate || createdStockItemRaw.expiryDate || null,
                updatedAt: createdStockItemRaw.UpdatedAt || createdStockItemRaw.updatedAt || '',
            };

            console.log('Mapped Created Stock Item:', createdStockItem); 

            setStockItems([...stockItems, createdStockItem]);
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        console.log('Updated Stock Items:', stockItems);
    }, [stockItems]);

    return (
        <div className="p-6" data-testid="stock-page">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-black">Stock Items</h1>
                    <p className="mt-2 text-sm text-black">Manage your inventory stock items.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={handleAddStockItem}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                        data-testid="open-add-stock-modal"
                        disabled={loadingItems || items.length === 0} 
                    >
                        Add Stock
                    </button>
                    <button
                        onClick={() => window.location.href = '/inventory/items'}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 ml-4"
                    >
                        Go to Items
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 p-4 rounded-md" data-testid="error-message">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {(loading || loadingItems) ? (
                <div className="mt-6 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <div className="mt-8 flow-root">
                    {/* Render stock items table or list here */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Arrival Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stockItems.map((stock) => (
                                <tr key={`stock-${stock.id}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{stock.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{getItemName(stock.itemId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{stock.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        {stock.arrivalDate
                                            ? new Intl.DateTimeFormat('nl-NL', {
                                                  day: '2-digit',
                                                  month: '2-digit',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              }).format(new Date(stock.arrivalDate))
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        {stock.expiryDate
                                            ? new Intl.DateTimeFormat('nl-NL', {
                                                  day: '2-digit',
                                                  month: '2-digit',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                              }).format(new Date(stock.expiryDate))
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">
                                        <button
                                            onClick={() => handleEdit(stock)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            data-testid={`edit-stock-${stock.id}`}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(stock)}
                                            className="text-red-600 hover:text-red-900"
                                            data-testid={`delete-stock-${stock.id}`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                data-testid="delete-confirm-modal"
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setStockItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                itemName={`Stock Item ${stockItemToDelete?.id}`}
            />

            {/* Add Stock Modal */}
            <AddStockModal
                data-testid="add-stock-modal"
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleCreate}
                items={items} // Passed items prop
            />

            {/* Edit Stock Modal */}
            <EditStockModal
                data-testid="edit-stock-modal"
                stockItem={selectedStockItem}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedStockItem(null);
                }}
                onSave={handleSave}
            />
        </div>
    );
}
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EditItemModal } from '../components/EditItemModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { AddItemModal } from '../components/AddItemModal'; // Import AddItemModal

interface Item {
    id: number;
    name: string;
    unit: string;
    description: string;
    price: number;
    createdAt: string;
}

export default function ItemsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add state for AddItemModal
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);

    const fetchItems = async () => {
        setLoading(true);
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
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
                setItems(data.data);
            } else if (Array.isArray(data)) {
                setItems(data);
            } else {
                setItems([]);
                setError('Unexpected data format received from API.');
            }
        } catch (error: any) {
            console.error(error);
            setError(error.message || 'An error occurred while fetching items.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: Item) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item: Item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async (updatedItem: Item) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5079/api/Inventory/items/${updatedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }

            setItems(items.map(item => 
                item.id === updatedItem.id ? updatedItem : item
            ));
            setIsEditModalOpen(false);
            setSelectedItem(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5079/api/Inventory/items/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            setItems(items.filter(item => item.id !== itemToDelete.id));
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleAddItem = () => {
        setIsAddModalOpen(true); // Open AddItemModal
    };

    const handleCreate = async (newItem: Omit<Item, 'id' | 'createdAt'>) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5079/api/Inventory/items', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newItem,
                createdAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const createdItem = await response.json();
            setItems([...items, createdItem]);
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="p-6" data-testid="items-page">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Items</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all items in your inventory
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        data-testid="add-item-button"
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Item
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 bg-red-50 p-4 rounded-md" data-testid="error-message">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="mt-6 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-gray-300" data-testid="items-table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Unit</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td data-testid={`item-name-${item.id}`} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{item.name}</td>
                                            <td data-testid={`item-unit-${item.id}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.unit}</td>
                                            <td data-testid={`item-description-${item.id}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.description}</td>
                                            <td data-testid={`item-price-${item.id}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">€{item.price.toFixed(2)}</td>
                                            <td data-testid={`item-date-${item.id}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {new Intl.DateTimeFormat('nl-NL', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                }).format(new Date(item.createdAt))}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                <button
                                                    data-testid={`edit-item-${item.id}`}
                                                    onClick={() => handleEdit(item)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    aria-label={`Edit ${item.name}`}
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button 
                                                    data-testid={`delete-item-${item.id}`}
                                                    onClick={() => handleDelete(item)}
                                                    className="text-red-600 hover:text-red-900"
                                                    aria-label={`Delete ${item.name}`}
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            <EditItemModal
                data-testid="edit-modal"
                item={selectedItem}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                }}
                onSave={handleSave}
            />

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                data-testid="delete-modal"
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete?.name || ''}
            />

            {/* Add Item Modal */}
            <AddItemModal
                data-testid="add-modal"
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleCreate}
            />
        </div>
    );
}
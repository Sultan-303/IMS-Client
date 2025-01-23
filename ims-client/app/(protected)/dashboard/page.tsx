'use client';

import React, { useState } from 'react';
import { DashboardStats, LowStockItem, NearExpiryItem } from '../../types/dashboard';
import Link from 'next/link';
import { MagnifyingGlassIcon, ExclamationTriangleIcon, ClockIcon, PlusIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
    const [stats] = useState<DashboardStats>({
        lowStockItemsCount: 5,
        nearExpiryItemsCount: 3,
        amountSoldToday: 150,
        lowStockItems: [
            { id: 1, productName: 'Milk 1L', currentStock: 2 },
            { id: 2, productName: 'White Bread', currentStock: 1 },
            { id: 3, productName: 'Eggs (12pk)', currentStock: 4 },
            { id: 4, productName: 'Bananas', currentStock: 3 },
            { id: 5, productName: 'Chicken Breast', currentStock: 2 },
        ],
        nearExpiryItems: [
            { id: 6, productName: 'Greek Yogurt', expiryDate: '2025-01-24', category: 'Dairy' },
            { id: 7, productName: 'Sliced Ham', expiryDate: '2025-01-23', category: 'Deli' },
            { id: 8, productName: 'Fresh Tomatoes', expiryDate: '2025-01-25', category: 'Produce' },
        ],
    });

    const [isReorderLoading, setIsReorderLoading] = useState<boolean>(false);
    const [reorderConfirmation, setReorderConfirmation] = useState<string>('');

    const handleReorder = () => {
        setIsReorderLoading(true);
        setTimeout(() => {
            setIsReorderLoading(false);
            setReorderConfirmation('Reorder request has been sent to suppliers successfully!');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Inventory Dashboard
                    </h1>
                    <Link href="/inventory/stock">
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            <Cog8ToothIcon className="h-5 w-5 mr-2" />
                            Manage Inventory
                        </button>
                    </Link>
                </div>
                <div className="relative mt-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Search products"
                    />
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {stats.lowStockItemsCount}
                    </p>
                    <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400 mt-2" />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm font-medium text-gray-600">Near Expiry Items</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        {stats.nearExpiryItemsCount}
                    </p>
                    <ClockIcon className="h-6 w-6 text-red-500 mt-2" />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm font-medium text-gray-600">Amount Sold Today</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        ${stats.amountSoldToday}
                    </p>
                    <PlusIcon className="h-6 w-6 text-green-500 mt-2" />
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                        120
                    </p>
                    <MagnifyingGlassIcon className="h-6 w-6 text-blue-500 mt-2" />
                </div>
            </div>

            {/* Low Stock Items Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Low Stock Items</h2>
                    <button
                        onClick={handleReorder}
                        disabled={isReorderLoading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isReorderLoading ? 'Reordering...' : 'Reorder Now'}
                    </button>
                </div>
                {reorderConfirmation && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        {reorderConfirmation}
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Current Stock
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.lowStockItems.map((item: LowStockItem) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {item.productName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                        {item.currentStock}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Near Expiry Items Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Near Expiry Items</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Expiry Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Days Remaining
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.nearExpiryItems.map((item: NearExpiryItem) => {
                                const daysRemaining = Math.ceil((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                const isCritical = daysRemaining <= 3;
                                return (
                                    <tr key={item.id}>
                                        <td className={`px-6 py-4 whitespace-nowrap ${isCritical ? 'text-red-500' : 'text-gray-900'}`}>
                                            {item.productName}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${isCritical ? 'text-red-500' : 'text-gray-900'}`}>
                                            {new Date(item.expiryDate).toLocaleDateString()}
                                            {isCritical && (
                                                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 inline ml-2" />
                                            )}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${isCritical ? 'text-red-500 font-semibold' : 'text-gray-900'}`}>
                                            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            {item.category}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            <Link href="/transactions">
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    View Transactions
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Additional Cool Features */}
            <section className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Total Sales Today: ${stats.amountSoldToday}</p>
                    <Link href="/sales">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                            View Detailed Sales
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    )};

'use client';

import React from 'react';

interface Transaction {
    id: number;
    productName: string;
    quantity: number;
    price: number;
    date: string;
}

const mockTransactions: Transaction[] = [
    { id: 1, productName: 'Milk 1L', quantity: 5, price: 4.50, date: '2024-04-25' },
    { id: 2, productName: 'White Bread', quantity: 2, price: 2.99, date: '2024-04-25' },
    { id: 3, productName: 'Eggs (12pk)', quantity: 10, price: 6.99, date: '2024-04-24' },
    { id: 4, productName: 'Bananas', quantity: 1, price: 3.99, date: '2024-04-23' },
    { id: 5, productName: 'Chicken Breast', quantity: 7, price: 12.99, date: '2024-04-22' },
];

export default function TransactionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">All Transactions</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                Price ($)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {mockTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {transaction.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {transaction.productName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {transaction.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {transaction.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
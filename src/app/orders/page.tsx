'use client';

import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function OrdersPage() {
  const orders = [
    { id: 'BZ123456', date: '15 Jan 2026', status: 'Delivered', statusColor: 'text-green-600 bg-green-50', total: 9799, items: ['35CC Brush Cutter', 'Tap&Go Kit'] },
    { id: 'BZ123455', date: '10 Jan 2026', status: 'In Transit', statusColor: 'text-amber-600 bg-amber-50', total: 17538, items: ['72CC Earth Auger'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 page-with-nav">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/account" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">My Orders</h1>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-4">Start shopping to see your orders here</p>
          <Link href="/catalog" className="btn-bz-primary px-6 py-3">Browse Products</Link>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">#{order.id}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${order.statusColor}`}>{order.status}</span>
                </div>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-600 mb-2">{order.items.join(', ')}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">₹{order.total.toLocaleString('en-IN')}</span>
                  <button className="text-emerald-600 text-sm font-semibold">View Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

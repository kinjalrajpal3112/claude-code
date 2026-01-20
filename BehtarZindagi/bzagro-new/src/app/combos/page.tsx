'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function CombosPage() {
  const combos = [
    { id: 1, name: '35CC Brush Cutter + Tap&Go + 3T Blade Kit', price: 9799, mrp: 28000, discount: 65, savings: 18201, tag: '🔥 BEST SELLER' },
    { id: 2, name: '72CC Earth Auger + 12 inch Drill Bit Combo', price: 17538, mrp: 35999, discount: 51, savings: 18461, tag: '🚜 TILLER KIT' },
    { id: 3, name: 'Poultry Feeder + Drinker Complete Setup', price: 4799, mrp: 8989, discount: 47, savings: 4190, tag: '🐔 POULTRY' },
    { id: 4, name: 'Milking Machine + Bucket Set', price: 28999, mrp: 45000, discount: 36, savings: 16001, tag: '🥛 DAIRY' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 page-with-nav">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">🍔 Combo Deals</h1>
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded ml-auto">538 Combos</span>
        </div>
      </header>

      <div className="p-4 grid gap-3">
        {combos.map(combo => (
          <Link key={combo.id} href={`/product/${combo.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-bold">{combo.tag}</span>
              <span className="bg-white/25 px-2 py-0.5 rounded text-sm">{combo.discount}% OFF</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{combo.name}</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xl font-bold text-emerald-700">₹{combo.price.toLocaleString('en-IN')}</span>
                <span className="text-gray-400 line-through">₹{combo.mrp.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-red-50 border border-red-100 text-red-600 font-bold px-3 py-2 rounded-lg inline-block">
                💰 बचत ₹{combo.savings.toLocaleString('en-IN')}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

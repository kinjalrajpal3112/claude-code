'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Bell, ShoppingCart, X, Phone, Package, PlayCircle, User, Home, Gift, LayoutGrid } from 'lucide-react';
import { APP_CONFIG } from '@/config/api';

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-base font-extrabold">
              <span className="text-emerald-600">बेहतर</span>
              <span className="text-amber-500">ज़िंदगी</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              href="/cart"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[999] transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="bg-emerald-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="text-lg font-bold">बेहतर ज़िंदगी</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-3">
          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>
          <Link
            href="/combos"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Gift className="w-5 h-5" />
            <span className="font-medium">Combo Deals</span>
          </Link>
          <Link
            href="/catalog"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="font-medium">All Categories</span>
          </Link>
          <Link
            href="/cart"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Cart</span>
          </Link>
          <Link
            href="/orders"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">My Orders</span>
          </Link>
          <Link
            href="/videos"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            <span className="font-medium">BZ TV</span>
          </Link>
          <Link
            href="/account"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100">
          <a
            href={`tel:${APP_CONFIG.PHONE}`}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call: {APP_CONFIG.PHONE}
          </a>
        </div>
      </div>
    </>
  );
}

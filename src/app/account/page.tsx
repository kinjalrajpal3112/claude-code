'use client';

import Link from 'next/link';
import { ArrowLeft, User, Package, MapPin, Phone, LogOut, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { APP_CONFIG } from '@/config/api';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 page-with-nav">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">My Account</h1>
        </div>
      </header>

      <div className="bg-emerald-600 text-white p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">किसान</h2>
            <p className="text-emerald-100">+91 XXXXXXXXXX</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <Link href="/orders" className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-900">My Orders</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Saved Addresses</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <a href={`tel:${APP_CONFIG.PHONE}`} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Help & Support</span>
              <p className="text-sm text-gray-500">{APP_CONFIG.PHONE}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </a>

        <button className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-medium text-red-600">Logout</span>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

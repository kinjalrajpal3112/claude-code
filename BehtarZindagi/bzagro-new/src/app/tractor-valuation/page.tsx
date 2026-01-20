'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TractorValuationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">🚜 Tractor Valuation</h1>
        </div>
      </header>

      <div className="w-full h-[calc(100vh-56px)]">
        <iframe
          src="https://tractor.behtarzindagi.in/tractor"
          className="w-full h-full border-0"
          title="Tractor Valuation"
        />
      </div>
    </div>
  );
}

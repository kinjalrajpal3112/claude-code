'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Play,
  MessageCircle,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { APP_CONFIG } from '@/config/api';

// Mock combo data - replace with API call later
const comboData: Record<number, any> = {
  1: {
    id: 1,
    name: '35CC Brush Cutter + Tap&Go + 3T Blade Kit',
    price: 9799,
    mrp: 28000,
    discount: 65,
    savings: 18201,
    tag: '🔥 BEST SELLER',
    features: ['Tested Together', '1 Yr Warranty', 'Free Delivery', 'Easy Returns'],
    description: 'Complete brush cutting solution with powerful 35CC engine, Tap&Go starter system, and 3T blade kit. Perfect for agricultural and landscaping needs.',
    image: '🌾',
  },
  2: {
    id: 2,
    name: '72CC Earth Auger + 12 inch Drill Bit Combo',
    price: 17538,
    mrp: 35999,
    discount: 51,
    savings: 18461,
    tag: '🚜 TILLER KIT',
    features: ['Pre-matched', 'Free Delivery', '1 Yr Warranty'],
    description: 'Heavy-duty earth auger with 72CC engine and 12-inch drill bit. Ideal for digging holes for fencing, planting, and construction work.',
    image: '🚜',
  },
  3: {
    id: 3,
    name: 'Poultry Feeder + Drinker Complete Setup',
    price: 4799,
    mrp: 8989,
    discount: 47,
    savings: 4190,
    tag: '🐔 POULTRY',
    features: ['Complete Kit', 'Easy Setup', 'Durable Material'],
    description: 'Complete poultry feeding solution with automatic feeder and drinker system. Ensures proper nutrition and hydration for your birds.',
    image: '🐔',
  },
};

export default function ComboDetailPage() {
  const params = useParams();
  const router = useRouter();
  const comboId = Number(params.id);

  const [combo, setCombo] = useState<any>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (comboId && comboData[comboId]) {
      setCombo(comboData[comboId]);
    }
  }, [comboId]);

  if (!combo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Combo not found</p>
          <button
            onClick={() => router.back()}
            className="text-emerald-600 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-with-cta">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm font-semibold text-gray-900">Combo Details</span>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg">
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
            <Link
              href="/cart"
              className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg relative"
            >
              <ShoppingCart className="w-4 h-4 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Image/Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 relative">
        <div className="w-full h-72 flex items-center justify-center">
          <span className="text-9xl">{combo.image}</span>
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 text-amber-700 text-sm font-bold px-3 py-1.5 rounded-lg">
            {combo.tag}
          </span>
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
            {combo.discount}% OFF
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="bg-white p-4 mt-2">
        <h1 className="text-lg font-bold text-gray-900 leading-tight mb-3">
          {combo.name}
        </h1>

        {/* Price Section */}
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-emerald-700">
              ₹{combo.price.toLocaleString('en-IN')}
            </span>
            <span className="text-lg text-gray-400 line-through">
              ₹{combo.mrp.toLocaleString('en-IN')}
            </span>
            <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">
              {combo.discount}% OFF
            </span>
          </div>
          <div className="bg-red-50 border border-red-100 text-red-600 font-bold text-sm mt-2 px-3 py-2 rounded-lg">
            💰 आप बचाएंगे ₹{combo.savings.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Features */}
        <div className="mt-4">
          <h3 className="font-bold text-gray-900 mb-2">✨ Combo Features</h3>
          <div className="flex flex-wrap gap-2">
            {combo.features.map((feature: string, i: number) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 mt-2">
        <h3 className="font-bold text-gray-900 mb-3">📝 Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {combo.description}
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white p-4 mt-2">
        <h3 className="font-bold text-gray-900 mb-3">🎁 Why Choose This Combo?</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Free Delivery</div>
              <div className="text-xs text-gray-500">Delivered to your doorstep</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">1 Year Warranty</div>
              <div className="text-xs text-gray-500">Brand warranty included</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">7 Days Return</div>
              <div className="text-xs text-gray-500">Easy returns if damaged</div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${APP_CONFIG.WHATSAPP}?text=Hi, I'm interested in ${combo.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom) + 16px)' }}
      >
        <MessageCircle className="w-6 h-6 text-white" fill="white" />
      </a>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-safe z-50 flex gap-3">
        <button className="flex-1 border-2 border-emerald-600 text-emerald-600 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <Link
          href={`/checkout?combo=${comboId}`}
          className="flex-[1.5] bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          ⚡ Buy Now
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

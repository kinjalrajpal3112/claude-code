'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Plus,
  Minus,
  Check,
  Shield,
  RotateCcw,
  Phone,
  Lock,
} from 'lucide-react';
import { api } from '@/services/api';
import { RAZORPAY_CONFIG, APP_CONFIG } from '@/config/api';

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  image?: string;
}

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  
  // Demo data - replace with actual cart/user data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Cycle Wheel Hoe with 7 inch Weeder and 3 Tooth Cultivator',
      price: 3799,
      mrp: 6999,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Balwaan Battery Sprayer 2in1 with 4 Nozzles',
      price: 2949,
      mrp: 5000,
      quantity: 1,
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState<Address>({
    id: 1,
    name: 'रामेश कुमार',
    phone: '+91 98765 43210',
    address: '123, Village Road, Near Panchayat Bhawan, Block - Sadar, District - Meerut, Uttar Pradesh - 250001',
    type: 'HOME',
    isDefault: true,
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: 'BZ200',
    discount: 200,
  });
  const [loading, setLoading] = useState(false);

  // Price calculations
  const itemsTotal = cartItems.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const productDiscount = cartItems.reduce(
    (sum, item) => sum + (item.mrp - item.price) * item.quantity,
    0
  );
  const couponDiscount = appliedCoupon?.discount || 0;
  const deliveryCharges = 0; // Free delivery
  const totalAmount = itemsTotal - productDiscount - couponDiscount + deliveryCharges;
  const totalSavings = productDiscount + couponDiscount;

  // Update quantity
  function updateQuantity(id: number, delta: number) {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  }

  // Apply coupon
  async function applyCoupon() {
    if (!couponCode.trim()) return;
    
    try {
      // Call API to verify coupon
      // const response = await api.verifyCoupon(...)
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount: 200 });
      setCouponCode('');
    } catch (error) {
      alert('Invalid coupon code');
    }
  }

  // Remove coupon
  function removeCoupon() {
    setAppliedCoupon(null);
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle payment
  async function handlePayment() {
    setLoading(true);
    
    try {
      // 1. Create order in backend (get order_id from your server)
      // const orderResponse = await api.createOrder({ ... });
      // const razorpayOrderId = orderResponse.razorpay_order_id;

      // 2. Open Razorpay checkout
      const options = {
        key: RAZORPAY_CONFIG.KEY_ID,
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: RAZORPAY_CONFIG.COMPANY_NAME,
        description: `Order for ${cartItems.length} items`,
        image: RAZORPAY_CONFIG.LOGO,
        // order_id: razorpayOrderId, // Uncomment when integrating with backend
        handler: async function (response: any) {
          // Payment successful
          console.log('Payment Success:', response);
          
          // 3. Verify payment on backend
          // await api.completePayment({
          //   razorpay_payment_id: response.razorpay_payment_id,
          //   razorpay_order_id: response.razorpay_order_id,
          //   razorpay_signature: response.razorpay_signature,
          // });
          
          // 4. Redirect to success page
          router.push('/order-success');
        },
        prefill: {
          name: selectedAddress.name,
          contact: selectedAddress.phone.replace(/\D/g, ''),
        },
        notes: {
          address: selectedAddress.address,
        },
        theme: {
          color: RAZORPAY_CONFIG.THEME_COLOR,
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment Failed:', response.error);
        alert('Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-base font-bold text-gray-900">Checkout</span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white px-4 py-4 flex items-center justify-center gap-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
            ✓
          </span>
          <span className="text-xs font-semibold">Cart</span>
        </div>
        <div className="w-8 h-0.5 bg-emerald-600"></div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
            2
          </span>
          <span className="text-xs font-semibold">Checkout</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200"></div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
            3
          </span>
          <span className="text-xs font-medium">Pay</span>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Delivery Address
          </h3>
          <button className="text-emerald-600 text-sm font-semibold">Change</button>
        </div>
        <div className="p-4">
          <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4 relative">
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              🏠 {selectedAddress.type}
            </span>
            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div className="mt-2">
              <div className="font-bold text-gray-900">{selectedAddress.name}</div>
              <div className="text-sm text-gray-600 mt-0.5">{selectedAddress.phone}</div>
              <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                {selectedAddress.address}
              </div>
            </div>
          </div>
          <button className="w-full mt-3 py-3 border-2 border-dashed border-gray-300 rounded-xl text-emerald-600 font-semibold text-sm flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">📦 Order Summary ({cartItems.length} items)</h3>
        </div>
        <div className="p-4 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-bold text-emerald-700">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon */}
      <div className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">🏷️ Apply Coupon</h3>
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter Coupon Code"
              className="flex-1 input-bz uppercase"
            />
            <button
              onClick={applyCoupon}
              className="bg-emerald-600 text-white px-5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors"
            >
              Apply
            </button>
          </div>
          
          {appliedCoupon && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎉</span>
                <div>
                  <div className="font-bold text-emerald-700 text-sm">
                    {appliedCoupon.code} Applied!
                  </div>
                  <div className="text-xs text-emerald-600">
                    You saved ₹{appliedCoupon.discount}
                  </div>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-red-500 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Price Details */}
      <div className="bg-white mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">🧾 Price Details</h3>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Items Total ({cartItems.length} items)</span>
            <span className="font-medium">₹{itemsTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Product Discount</span>
            <span className="font-medium">- ₹{productDiscount.toLocaleString('en-IN')}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Coupon ({appliedCoupon.code})</span>
              <span className="font-medium">- ₹{couponDiscount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery</span>
            <span className="font-medium text-emerald-600">FREE</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-3 mt-2 border-t border-dashed border-gray-200">
            <span>Total Amount</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 mt-3 text-center">
            <span className="text-emerald-700 font-semibold text-sm">
              🎉 You're saving ₹{totalSavings.toLocaleString('en-IN')} on this order!
            </span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-around">
          <div className="text-center">
            <Lock className="w-6 h-6 mx-auto text-gray-600 mb-1" />
            <div className="text-[10px] text-gray-500 leading-tight">Secure<br />Payment</div>
          </div>
          <div className="text-center">
            <Check className="w-6 h-6 mx-auto text-gray-600 mb-1" />
            <div className="text-[10px] text-gray-500 leading-tight">100%<br />Genuine</div>
          </div>
          <div className="text-center">
            <RotateCcw className="w-6 h-6 mx-auto text-gray-600 mb-1" />
            <div className="text-[10px] text-gray-500 leading-tight">7 Day<br />Returns</div>
          </div>
          <div className="text-center">
            <Shield className="w-6 h-6 mx-auto text-gray-600 mb-1" />
            <div className="text-[10px] text-gray-500 leading-tight">Warranty<br />Support</div>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-white mx-4 mt-3 rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 text-sm text-gray-600">
        Need help?{' '}
        <a href={`tel:${APP_CONFIG.PHONE}`} className="text-emerald-600 font-semibold flex items-center gap-1">
          <Phone className="w-4 h-4" />
          Call {APP_CONFIG.PHONE}
        </a>
      </div>

      {/* Razorpay Note */}
      <div className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
        🔐 Secured by Razorpay • UPI, Cards, NetBanking, EMI
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-safe z-50 flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500">Total Amount</div>
          <div className="text-2xl font-extrabold text-gray-900">
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2 hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Lock className="w-4 h-4" />
          )}
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}

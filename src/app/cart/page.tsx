'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import { api } from '@/services/api';
import { isAuthenticated, getMobileNumber } from '@/utils/auth';

interface CartItem {
  PackageID?: number;
  PackageId?: number; // API uses PackageId (camelCase)
  BzProductId?: number;
  RecordId?: number;
  ProductName: string;
  ProductHindiName?: string;
  ProductName_Hindi?: string;
  OnlinePrice: number;
  OurPrice: number;
  MRP: number;
  Quantity: number;
  ImagePath?: string;
  TotalPrice?: number;
  BrandName?: string;
  UnitName?: string;
  OfferDiscount?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null); // Track which item is being updated
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' }>({ visible: false, message: '' });

  useEffect(() => {
    if (isAuthenticated()) {
      loadCartItems();
    } else {
      router.push('/login?returnUrl=/cart');
    }
  }, []);

  // Refresh cart when page becomes visible (user might have added items in another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated()) {
        loadCartItems();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  async function loadCartItems() {
    const mobileNo = getMobileNumber();
    if (!mobileNo) {
      console.warn('No mobile number found, redirecting to login');
      router.push('/login?returnUrl=/cart');
      return;
    }

    setLoading(true);
    try {
      const cleanMobileNo = mobileNo.replace(/\D/g, '');
      console.log('=== Loading Cart Items ===');
      console.log('Mobile number from storage:', mobileNo);
      console.log('Cleaned mobile number:', cleanMobileNo);
      console.log('Request URL will be: /api/cart?MobileNo=' + cleanMobileNo);
      
      const response = await api.getCartItems(cleanMobileNo);
      console.log('=== Cart Items API Response ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // Handle different response structures - API returns CartApiReponse.Items
      let items = response?.CartApiReponse?.Items  // Correct field name from API (note: "Reponse" not "Response")
               || response?.CartApiResponse?.Items
               || response?.cartApiReponse?.Items
               || response?.CartItems 
               || response?.cartItems
               || response?.data?.CartApiReponse?.Items
               || response?.data?.CartApiResponse?.Items
               || response?.data?.CartItems
               || response?.data?.cartItems
               || response?.data
               || [];
      
      // If items is not an array, try to extract array from it
      if (!Array.isArray(items) && typeof items === 'object') {
        console.log('Items is not an array, trying to extract...');
        // Try to find array in nested structure
        const possibleArrays = Object.values(items).filter(v => Array.isArray(v));
        if (possibleArrays.length > 0) {
          console.log('Found arrays in response:', possibleArrays.length);
          items = possibleArrays[0];
        } else {
          console.log('No arrays found in response object');
          items = [];
        }
      }
      
      console.log('=== Extracted Cart Items ===');
      console.log('Items:', items);
      console.log('Items count:', Array.isArray(items) ? items.length : 0);
      if (Array.isArray(items) && items.length > 0) {
        console.log('First item structure:', JSON.stringify(items[0], null, 2));
      }
      
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Failed to load cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity < 1) {
      removeItem(item);
      return;
    }

    const mobileNo = getMobileNumber();
    if (!mobileNo) {
      router.push('/login');
      return;
    }

    const packageId = item.PackageID || item.PackageId || item.BzProductId || 0;
    setUpdating(packageId);
    try {
      // Remove old quantity and add new quantity
      // First remove the item
      const bzProductId = item.BzProductId || item.PackageID || item.PackageId || 0;
      await api.removeFromCart({
        MobileNo: mobileNo,
        BzProductId: bzProductId,
      });
      
      // Then add with new quantity
      const response = await api.addToCart({
        MobileNo: mobileNo,
        BzProductId: bzProductId,
        Quantity: newQuantity,
      });

      if (response?.success !== false) {
        // Reload cart items
        await loadCartItems();
        setToast({ visible: true, message: 'Cart updated successfully!' });
      } else {
        setToast({ visible: true, message: response?.message || 'Failed to update cart', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setToast({ visible: true, message: 'Failed to update quantity. Please try again.', type: 'error' });
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(item: CartItem) {
    const mobileNo = getMobileNumber();
    if (!mobileNo) {
      router.push('/login');
      return;
    }

    const packageId = item.PackageID || item.PackageId || item.BzProductId || 0;
    setUpdating(packageId);
    try {
      const bzProductId = item.BzProductId || item.PackageID || item.PackageId || 0;
      const response = await api.removeFromCart({
        MobileNo: mobileNo,
        BzProductId: bzProductId,
      });

      if (response?.success !== false) {
        // Reload cart items
        await loadCartItems();
        setToast({ visible: true, message: 'Item removed from cart!' });
      } else {
        setToast({ visible: true, message: response?.message || 'Failed to remove item', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      setToast({ visible: true, message: 'Failed to remove item. Please try again.', type: 'error' });
    } finally {
      setUpdating(null);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.OnlinePrice) || item.OurPrice || 0;
    const quantity = item.Quantity || 1;
    return sum + price * quantity;
  }, 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50 page-with-cta">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Cart ({cartItems.length})</h1>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">Add some products to get started</p>
          <Link href="/catalog" className="btn-bz-primary px-6 py-3">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-3">
            {cartItems.map(item => {
              // Handle both PackageID and PackageId field names (API uses PackageId)
              const packageId = item.PackageID || item.PackageId || item.BzProductId || 0;
              const price = Number(item.OnlinePrice) || item.OurPrice || 0;
              const mrp = item.MRP || 0;
              const quantity = item.Quantity || 1;
              const isUpdating = updating === packageId;
              
              return (
                <div key={packageId} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.ImagePath ? (
                        <img src={item.ImagePath} alt={item.ProductName || ''} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.ProductHindiName || item.ProductName_Hindi || item.ProductName || 'Product'}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-bold text-emerald-700">₹{price.toLocaleString('en-IN')}</span>
                        {mrp > price && (
                          <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item, quantity - 1)}
                            disabled={isUpdating}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-6 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(item, quantity + 1)}
                            disabled={isUpdating}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item)}
                          disabled={isUpdating}
                          className="text-red-500 disabled:opacity-50 disabled:cursor-not-allowed hover:text-red-700 transition-colors"
                        >
                          {isUpdating ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-emerald-600">FREE</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom))] left-0 right-0 p-4 bg-white border-t border-gray-100">
            <Link href="/checkout" className="btn-bz-primary w-full py-3.5 flex items-center justify-center gap-2">
              Proceed to Checkout <span className="font-bold">₹{total.toLocaleString('en-IN')}</span>
            </Link>
          </div>
        </>
      )}

      <BottomNav />
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={() => setToast({ ...toast, visible: false })} 
      />
    </div>
  );
}

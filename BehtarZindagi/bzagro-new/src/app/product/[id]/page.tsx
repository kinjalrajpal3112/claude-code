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
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import { api, Product } from '@/services/api';
import { APP_CONFIG } from '@/config/api';
import { isAuthenticated, getMobileNumber } from '@/utils/auth';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = Number(params.id);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    if (packageId) {
      loadProduct();
    }
  }, [packageId]);

  async function loadProduct() {
    try {
      const response = await api.getProductDetails(packageId);
      console.log('Product Details Response:', response);

      // Check if response indicates failure
      if (response?.success === false || response?.error) {
        console.error('API returned error:', response.error || response.message);
        setProduct(null);
        setLoading(false);
        return;
      }

      // Handle various response structures
      const productData = response?.data?.ProductDetails
                       || response?.data?.Product
                       || response?.ProductDetails
                       || response?.Product
                       || response?.data
                       || (response && typeof response === 'object' && !response.error ? response : null);

      if (productData) {
        setProduct(productData);
      } else {
        console.warn('Product data not found in response:', response);
        setProduct(null);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const mobileNo = getMobileNumber();
    if (!mobileNo) {
      router.push('/login');
      return;
    }

    setAddingToCart(true);
    try {
      const cleanMobileNo = mobileNo.replace(/\D/g, '');
      const bzProductId = (product as any).BzProductId || product.PackageID || (product as any).ProductId;

      const response = await api.addToCart({
        MobileNo: cleanMobileNo,
        BzProductId: bzProductId,
        Quantity: 1,
      });

      const isSuccess = response?.success === true
                     || response?.Status === true
                     || response?.Status === 'true'
                     || (response?.success !== false
                         && response?.Status !== false
                         && !response?.error);

      if (isSuccess) {
        setToast({ visible: true, message: 'Item added to cart successfully!', type: 'success' });
      } else {
        const errorMsg = response?.message || response?.error || 'Failed to add to cart';
        setToast({ visible: true, message: errorMsg, type: 'error' });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setToast({ visible: true, message: 'Failed to add to cart. Please try again.', type: 'error' });
    } finally {
      setAddingToCart(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Product not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-emerald-600 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const price = Number(product.OnlinePrice) || product.OurPrice || 0;
  const mrp = product.MRP || 0;
  const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const savings = mrp - price;

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
          <span className="text-sm font-semibold text-gray-900">Product Details</span>
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

      {/* Image Gallery */}
      <div className="bg-white relative">
        <div className="w-full h-72 bg-gray-50 flex items-center justify-center">
          {product.ImageUrl ? (
            <img
              src={product.ImageUrl}
              alt={product.ProductName}
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <span className="text-8xl">📦</span>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="bg-white p-4 mt-2">
        {product.BrandName && (
          <span className="text-emerald-600 text-sm font-semibold">{product.BrandName}</span>
        )}
        <h1 className="text-lg font-bold text-gray-900 mt-1 leading-tight">
          {product.ProductName}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-sm font-semibold">
            <Star className="w-3.5 h-3.5 fill-white" />
            <span>4.2</span>
          </div>
          <span className="text-sm text-gray-500">340 ratings</span>
        </div>

        {/* Price Section */}
        <div className="bg-emerald-50 rounded-xl p-4 mt-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-emerald-700">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {mrp > price && (
              <span className="text-lg text-gray-400 line-through">
                ₹{mrp.toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
          {savings > 0 && (
            <div className="text-emerald-700 font-semibold text-sm mt-1">
              💰 आप बचाएंगे ₹{savings.toLocaleString('en-IN')}
            </div>
          )}
          <div className="text-emerald-700 text-xs mt-2 pt-2 border-t border-emerald-200">
            📱 EMI available: <strong>₹{Math.round(price / 6).toLocaleString('en-IN')}/month</strong> (6 months)
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="bg-white p-4 mt-2">
        <h3 className="font-bold text-gray-900 mb-3">🏷️ Available Offers</h3>
        
        <div className="space-y-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
            <span className="text-xl">💳</span>
            <div>
              <div className="font-semibold text-amber-800 text-sm">Bank Offer</div>
              <div className="text-xs text-amber-700">10% off on HDFC Bank Credit Cards</div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3">
            <span className="text-xl">🎁</span>
            <div>
              <div className="font-semibold text-amber-800 text-sm">Coupon Discount</div>
              <div className="text-xs text-amber-700">Extra ₹200 off on orders above ₹3,000</div>
              <span className="inline-block mt-1 bg-white border border-dashed border-amber-400 text-amber-600 text-xs font-bold px-2 py-0.5 rounded">
                BZ200
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white p-4 mt-2">
        <h3 className="font-bold text-gray-900 mb-3">🚚 Delivery</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Delivery by Jan 22, Wed</div>
              <div className="text-xs text-gray-500">Free delivery</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">1 Year Warranty</div>
              <div className="text-xs text-gray-500">Brand warranty</div>
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

      {/* Description */}
      {product.Description && (
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-gray-900 mb-3">📝 Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
            {product.Description}
          </p>
          <button className="text-emerald-600 font-semibold text-sm mt-2">
            Read More →
          </button>
        </div>
      )}

      {/* Video */}
      {product.VideoUrl && (
        <div className="bg-white p-4 mt-2">
          <h3 className="font-bold text-gray-900 mb-3">🎬 Product Video</h3>
          <div className="w-full h-44 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center relative cursor-pointer">
            <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-900 ml-1" />
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Float */}
      <a
        href={`https://wa.me/${APP_CONFIG.WHATSAPP}?text=Hi, I have a question about ${product.ProductName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom) + 16px)' }}
      >
        <MessageCircle className="w-6 h-6 text-white" fill="white" />
      </a>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-safe z-50 flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="flex-1 border-2 border-emerald-600 text-emerald-600 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
        <Link
          href={`/checkout?product=${packageId}`}
          className="flex-[1.5] bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          ⚡ Buy Now
        </Link>
      </div>

      <Toast
        message={toast.message}
        type={toast.type || 'success'}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}

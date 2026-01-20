'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, ShoppingCart } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import { api, Product } from '@/services/api';
import { isAuthenticated, getMobileNumber } from '@/utils/auth';

// Business type mapping
const businessTypes: Record<number, { name: string; icon: string; description: string; categoryIds?: number[] }> = {
  1: {
    name: 'Dairy Farm',
    icon: '🐄',
    description: 'Complete dairy farming solutions including milking machines, feeders, and dairy equipment',
    categoryIds: [2], // Dairy Equipment category
  },
  2: {
    name: 'Poultry Farm',
    icon: '🐔',
    description: 'Poultry farming equipment including feeders, drinkers, and poultry management systems',
    categoryIds: [7], // Poultry category
  },
  3: {
    name: 'FPO / Dealer',
    icon: '👥',
    description: 'Bulk pricing and dealer solutions for Farmer Producer Organizations',
  },
  4: {
    name: 'Processing',
    icon: '🏭',
    description: 'Food processing equipment and machinery for agricultural products',
  },
};

export default function BusinessPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = Number(params.id);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ 
    visible: false, 
    message: '',
    type: 'success'
  });
  const business = businessTypes[businessId];

  useEffect(() => {
    if (businessId && business) {
      loadProducts();
    }
  }, [businessId]);

  async function loadProducts() {
    setLoading(true);
    try {
      if (business?.categoryIds && business.categoryIds.length > 0) {
        // Load products by category
        const categoryId = business.categoryIds[0];
        const productsRes = await api.getProductsByCategory(categoryId, 1, 50);
        
        const productArray = productsRes?.data?.ProductsApiReponse?.Product 
                          || productsRes?.ProductsApiReponse?.Product 
                          || productsRes?.Product
                          || [];
        setProducts(productArray);
      } else {
        // Load all products for business types without specific categories
        const productsRes = await api.getProducts(1, 50);
        
        const productArray = productsRes?.data?.ProductsApiReponse?.Product 
                          || productsRes?.ProductsApiReponse?.Product 
                          || productsRes?.Product
                          || [];
        setProducts(productArray);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated
    if (!isAuthenticated()) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    const mobileNo = getMobileNumber();
    if (!mobileNo) {
      router.push('/login');
      return;
    }

    setAddingToCart(product.PackageID);
    try {
      const response = await api.addToCart({
        MobileNo: parseInt(mobileNo.replace(/\D/g, '')),
        BzProductId: product.PackageID,
        Quantity: 1,
      });

      if (response?.success !== false) {
        setToast({ visible: true, message: 'Item added to cart successfully!' });
      } else {
        setToast({ visible: true, message: response?.message || 'Failed to add to cart', type: 'error' });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setToast({ visible: true, message: 'Failed to add to cart. Please try again.', type: 'error' });
    } finally {
      setAddingToCart(null);
    }
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Business type not found</p>
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
    <div className="min-h-screen bg-gray-50 page-with-nav">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{business.icon}</span>
            <h1 className="text-lg font-bold text-gray-900">{business.name}</h1>
          </div>
          <button className="ml-auto w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Business Info Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{business.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{business.name}</h2>
            <p className="text-sm opacity-90">{business.description}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <span className="text-sm font-semibold">
            {products.length > 0 ? `${products.length}+ Products Available` : 'Loading products...'}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-4 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">{business.icon}</span>
            <p className="text-gray-500 mb-2">No products found</p>
            <p className="text-sm text-gray-400">Check back later for {business.name} products</p>
            <Link
              href="/catalog"
              className="inline-block mt-4 text-emerald-600 font-semibold"
            >
              Browse All Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => {
              const price = Number(product.OnlinePrice) || product.OurPrice;
              const mrp = product.MRP;
              const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
              const isAdding = addingToCart === product.PackageID;

              return (
                <div key={product.PackageID} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <Link href={`/product/${product.PackageID}`} className="flex-1">
                    <div className="w-full h-32 bg-gray-50 flex items-center justify-center relative">
                      {product.ImagePath ? (
                        <img
                          src={product.ImagePath}
                          alt={product.ProductName || ''}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-4xl">📦</span>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-medium text-gray-600 line-clamp-2 h-8 leading-tight">
                        {product.ProductName_Hindi || product.ProductName || 'Product'}
                      </h3>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-sm font-bold text-emerald-700">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {mrp > price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isAdding}
                    className="mx-3 mb-3 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    {isAdding ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />

      <Toast
        message={toast.message}
        type={toast.type || 'success'}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}

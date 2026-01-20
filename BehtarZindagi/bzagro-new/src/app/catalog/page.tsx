'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Filter, ShoppingCart } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Toast from '@/components/Toast';
import { api, Product, Category } from '@/services/api';
import { isAuthenticated, getMobileNumber } from '@/utils/auth';

// Map category slugs to CategoryIds (from home page)
const categorySlugMap: Record<string, number> = {
  'tiller': 1,
  'dairy': 2,
  'irrigation': 3,
  'sprayer': 4,
  'chaff': 5,
  'engine': 6,
  'poultry': 7,
  'pump': 8,
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categorySlug = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ 
    visible: false, 
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Map slug to CategoryId if provided in URL
    if (categorySlug) {
      const categoryId = categorySlugMap[categorySlug];
      if (categoryId) {
        setSelectedCategory(categoryId);
        loadProductsByCategory(categoryId);
      } else {
        // Try to find by slug in loaded categories
        const foundCategory = categories.find(cat => cat.slug === categorySlug);
        if (foundCategory) {
          setSelectedCategory(foundCategory.CategoryId);
          loadProductsByCategory(foundCategory.CategoryId);
        } else {
          loadAllProducts();
        }
      }
    } else {
      loadAllProducts();
    }
  }, [categorySlug, categories]);

  async function loadCategories() {
    try {
      const categoriesRes = await api.getCategories();
      
      // Handle nested: data.Category.Category
      const categoryArray = categoriesRes?.data?.Category?.Category 
                         || categoriesRes?.Category?.Category
                         || categoriesRes?.Category
                         || [];
      setCategories(categoryArray);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }

  async function loadAllProducts() {
    setLoading(true);
    try {
      const productsRes = await api.getProducts(1, 50);
      
      // Handle nested: data.ProductsApiReponse.Product
      const productArray = productsRes?.data?.ProductsApiReponse?.Product 
                        || productsRes?.ProductsApiReponse?.Product 
                        || productsRes?.Product
                        || [];
      setProducts(productArray);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadProductsByCategory(categoryId: number) {
    setLoading(true);
    try {
      const productsRes = await api.getProductsByCategory(categoryId, 1, 50);
      
      // Handle nested: data.ProductsApiReponse.Product
      const productArray = productsRes?.data?.ProductsApiReponse?.Product 
                        || productsRes?.ProductsApiReponse?.Product 
                        || productsRes?.Product
                        || [];
      setProducts(productArray);
    } catch (error) {
      console.error('Failed to load products by category:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryClick(categoryId: number | null) {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      loadAllProducts();
    } else {
      loadProductsByCategory(categoryId);
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
      const cleanMobileNo = mobileNo.replace(/\D/g, '');
      console.log('=== Adding to Cart ===');
      console.log('Mobile number from storage:', mobileNo);
      console.log('Cleaned mobile number:', cleanMobileNo);
      console.log('Full product object:', JSON.stringify(product, null, 2));
      console.log('Product ID fields:', {
        PackageID: product.PackageID,
        BzProductId: (product as any).BzProductId,
        ProductId: (product as any).ProductId,
        ProductID: (product as any).ProductID,
      });
      console.log('Product Name:', product.ProductName || product.ProductName_Hindi);
      
      // API expects BzProductId - use PackageID if BzProductId is not available
      // Note: In some APIs, PackageID might actually be the BzProductId
      const bzProductId = (product as any).BzProductId || product.PackageID || (product as any).ProductId || (product as any).ProductID;
      
      console.log('Using BzProductId for cart:', bzProductId);
      
      const response = await api.addToCart({
        MobileNo: cleanMobileNo,
        BzProductId: bzProductId,
        Quantity: 1,
      });

      console.log('=== Add to Cart Response ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Success check:', {
        success: response?.success,
        Status: response?.Status,
        error: response?.error,
        hasError: !!response?.error,
        message: response?.message,
      });

      // More robust success detection
      const isSuccess = response?.success === true 
                     || response?.Status === true
                     || response?.Status === 'true'
                     || (response?.success !== false 
                         && response?.Status !== false 
                         && response?.Status !== 'false'
                         && !response?.error
                         && response?.message?.toLowerCase().includes('success'));

      console.log('Is success?', isSuccess);

      if (isSuccess) {
        setToast({ visible: true, message: 'Item added to cart successfully!' });
        
        // Wait a moment for API to update, then verify cart has the item
        // Try multiple times with increasing delays
        const verifyCart = async (attempt: number = 1, maxAttempts: number = 3) => {
          const delay = attempt * 1000; // 1s, 2s, 3s
          setTimeout(async () => {
            console.log(`=== Verifying Cart After Add (Attempt ${attempt}/${maxAttempts}) ===`);
            const verifyMobileNo = getMobileNumber();
            console.log('Verification mobile number:', verifyMobileNo);
            
            if (verifyMobileNo) {
              try {
                const cartResponse = await api.getCartItems(verifyMobileNo);
                console.log('Cart verification response:', JSON.stringify(cartResponse, null, 2));
                
                // Handle CartApiReponse.Items structure (note: "Reponse" not "Response")
                const items = cartResponse?.CartApiReponse?.Items
                           || cartResponse?.CartApiResponse?.Items
                           || cartResponse?.cartApiReponse?.Items
                           || cartResponse?.CartItems 
                           || cartResponse?.cartItems
                           || cartResponse?.data?.CartApiReponse?.Items
                           || cartResponse?.data?.CartApiResponse?.Items
                           || cartResponse?.data?.CartItems
                           || cartResponse?.data?.cartItems
                           || cartResponse?.data
                           || [];
                
                const itemsArray = Array.isArray(items) ? items : [];
                console.log('Items in cart after add:', itemsArray.length);
                
                if (itemsArray.length > 0) {
                  console.log('✅ Cart has items:', itemsArray);
                  // Check if our added product is in the cart
                  const bzProductId = (product as any).BzProductId || product.PackageID;
                  const foundProduct = itemsArray.find((item: any) => 
                    item.PackageID === bzProductId ||
                    item.PackageId === bzProductId ||
                    item.BzProductId === bzProductId ||
                    item.ProductId === bzProductId ||
                    item.PackageID === product.PackageID ||
                    item.PackageId === product.PackageID ||
                    item.BzProductId === product.PackageID
                  );
                  if (foundProduct) {
                    console.log('✅ Added product found in cart!');
                    console.log('Matched product:', foundProduct);
                  } else {
                    console.warn('⚠️ Added product NOT found in cart!');
                    console.log('BzProductId we added:', bzProductId);
                    console.log('Product PackageID:', product.PackageID);
                    console.log('Product IDs in cart:', itemsArray.map((i: any) => ({
                      PackageID: i.PackageID,
                      PackageId: i.PackageId,
                      BzProductId: i.BzProductId,
                      ProductId: i.ProductId
                    })));
                    
                    // Try again if not found and haven't reached max attempts
                    if (attempt < maxAttempts) {
                      verifyCart(attempt + 1, maxAttempts);
                    }
                  }
                } else {
                  console.warn(`⚠️ Cart is empty after adding item (Attempt ${attempt})!`);
                  if (attempt < maxAttempts) {
                    console.log(`Retrying in ${delay}ms...`);
                    verifyCart(attempt + 1, maxAttempts);
                  } else {
                    console.log('Max attempts reached. Cart still empty.');
                    console.log('Possible issues:');
                    console.log('1. Product ID mismatch (BzProductId vs PackageID)');
                    console.log('2. API delay longer than expected');
                    console.log('3. Mobile number mismatch');
                    console.log('4. API error (check response above)');
                  }
                }
              } catch (error) {
                console.error('Error verifying cart:', error);
                if (attempt < maxAttempts) {
                  verifyCart(attempt + 1, maxAttempts);
                }
              }
            } else {
              console.error('No mobile number available for verification');
            }
          }, delay);
        };
        
        verifyCart(1, 3); // Try 3 times with 1s, 2s, 3s delays
      } else {
        const errorMsg = response?.message || response?.error || 'Failed to add to cart';
        console.error('Add to cart failed:', errorMsg);
        setToast({ visible: true, message: errorMsg, type: 'error' });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setToast({ visible: true, message: 'Failed to add to cart. Please try again.', type: 'error' });
    } finally {
      setAddingToCart(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 page-with-nav">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">All Categories</h1>
          <button className="ml-auto w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <Filter className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.CategoryId}
              onClick={() => handleCategoryClick(cat.CategoryId)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.CategoryId 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {cat.CategoryHindi || cat.Categoryname}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
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
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => {
              const price = Number(product.OnlinePrice) || product.OurPrice;
              const mrp = product.MRP;
              const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

              const isAdding = addingToCart === product.PackageID;

              return (
                <div key={product.PackageID} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <Link href={`/product/${product.PackageID}`} className="flex-1">
                    <div className="w-full h-32 bg-gray-50 flex items-center justify-center relative">
                      {product.ImagePath ? (
                        <img src={product.ImagePath} alt={product.ProductName || ''} className="w-full h-full object-contain p-2" />
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
                        <span className="text-sm font-bold text-emerald-700">₹{price.toLocaleString('en-IN')}</span>
                        {mrp > price && (
                          <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
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

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

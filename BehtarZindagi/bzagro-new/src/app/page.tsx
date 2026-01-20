'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Mic, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import VideoCard from '@/components/VideoCard';
import { api, Product, Category } from '@/services/api';
import { APP_CONFIG } from '@/config/api';

// Hero Cards Component
function HeroSection() {
  return (
    <section className="p-4 grid grid-cols-2 gap-3">
      {/* AI Bot Card */}
      <a
        href={APP_CONFIG.BOT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-card hero-card-primary"
      >
        <span className="text-4xl mb-2">🤖</span>
        <h3 className="text-base font-bold leading-tight mb-1">AI से पूछो</h3>
        <p className="text-xs opacity-90 leading-snug">कुछ भी पूछो, हम बताएंगे सही product</p>
        <div className="absolute bottom-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowRight className="w-4 h-4" />
        </div>
      </a>

      {/* Tractor Valuation Card */}
      <Link href="/tractor-valuation" className="hero-card hero-card-secondary">
        <span className="text-4xl mb-2">🚜</span>
        <h3 className="text-base font-bold leading-tight mb-1">Tractor Value</h3>
        <p className="text-xs opacity-90 leading-snug">अपने ट्रैक्टर की सही कीमत जानें</p>
        <div className="absolute bottom-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </section>
  );
}

// Search Bar Component
function SearchBar() {
  const [searchText, setSearchText] = useState('');

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="खोजें 4,786+ products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        <button className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white hover:bg-emerald-700 transition-colors">
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Combo Deals Component
function CombosSection() {
  const combos = [
    {
      id: 1,
      name: '35CC Brush Cutter + Tap&Go + 3T Blade Kit',
      price: 9799,
      mrp: 28000,
      discount: 65,
      savings: 18201,
      tag: '🔥 BEST SELLER',
      features: ['Tested Together', '1 Yr Warranty'],
    },
    {
      id: 2,
      name: '72CC Earth Auger + 12 inch Drill Bit Combo',
      price: 17538,
      mrp: 35999,
      discount: 51,
      savings: 18461,
      tag: '🚜 TILLER KIT',
      features: ['Pre-matched', 'Free Delivery'],
    },
    {
      id: 3,
      name: 'Poultry Feeder + Drinker Complete Setup',
      price: 4799,
      mrp: 8989,
      discount: 47,
      savings: 4190,
      tag: '🐔 POULTRY',
      features: ['Complete Kit', 'Easy Setup'],
    },
  ];

  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="section-title-bz">🍔 Combo Deals</h2>
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            538 Combos
          </span>
        </div>
        <Link href="/combos" className="text-emerald-600 text-sm font-semibold">
          View All →
        </Link>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
        {combos.map((combo) => (
          <Link key={combo.id} href={`/combo/${combo.id}`} className="combo-card">
            <div className="combo-banner">
              <span>{combo.tag}</span>
              <span className="bg-white/25 px-2 py-0.5 rounded text-xs">
                {combo.discount}% OFF
              </span>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-2 line-clamp-2 h-10">
                {combo.name}
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-lg font-bold text-emerald-700">
                  ₹{combo.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{combo.mrp.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-2 py-1.5 rounded-lg">
                💰 बचत ₹{combo.savings.toLocaleString('en-IN')}
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {combo.features.map((f, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Categories Section
function CategoriesSection() {
  const categories = [
    { id: 1, name: 'Tiller & Weeders', hindi: 'टिलर', icon: '🚜', slug: 'tiller' },
    { id: 2, name: 'Dairy Equipment', hindi: 'डेयरी', icon: '🥛', slug: 'dairy' },
    { id: 3, name: 'Irrigation', hindi: 'सिंचाई', icon: '💧', slug: 'irrigation' },
    { id: 4, name: 'Sprayers', hindi: 'स्प्रेयर', icon: '🌿', slug: 'sprayer' },
    { id: 5, name: 'Chaff Cutter', hindi: 'चाफ कटर', icon: '🌾', slug: 'chaff' },
    { id: 6, name: 'Engines', hindi: 'इंजन', icon: '⚙️', slug: 'engine' },
    { id: 7, name: 'Poultry', hindi: 'पोल्ट्री', icon: '🐔', slug: 'poultry' },
    { id: 8, name: 'Pumps', hindi: 'पंप', icon: '🔧', slug: 'pump' },
  ];

  return (
    <section className="py-4 px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title-bz">🔧 Machines</h2>
        <Link href="/catalog" className="text-emerald-600 text-sm font-semibold">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalog?category=${cat.slug}`}
            className="flex flex-col items-center gap-1.5"
          >
            <div className="cat-icon">{cat.icon}</div>
            <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Business Section
function BusinessSection() {
  const businesses = [
    { id: 1, name: 'Dairy Farm', icon: '🐄', count: '418 products' },
    { id: 2, name: 'Poultry Farm', icon: '🐔', count: '105 products' },
    { id: 3, name: 'FPO / Dealer', icon: '👥', count: 'Bulk Pricing' },
    { id: 4, name: 'Processing', icon: '🏭', count: '275 products' },
  ];

  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title-bz">🏢 By Business</h2>
        <Link href="/business" className="text-emerald-600 text-sm font-semibold">
          View All →
        </Link>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
        {businesses.map((biz) => (
          <Link key={biz.id} href={`/business/${biz.id}`} className="business-card">
            <div className="text-3xl mb-2">{biz.icon}</div>
            <div className="text-sm font-semibold text-gray-900">{biz.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{biz.count}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Best Sellers Section
function BestSellersSection({ products }: { products: Product[] }) {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title-bz">🔥 Best Sellers</h2>
        <Link href="/bestsellers" className="text-emerald-600 text-sm font-semibold">
          View All →
        </Link>
      </div>

      <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
        {products.slice(0, 6).map((product) => {
          const price = Number(product.OnlinePrice) || product.OurPrice;
          const mrp = product.MRP;
          const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

          return (
            <Link
              key={product.PackageID}
              href={`/product/${product.PackageID}`}
              className="product-card"
            >
              <div className="w-full h-28 bg-gray-50 flex items-center justify-center relative">
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
                  <span className="absolute top-2 left-2 discount-badge">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <h3 className="text-[11px] font-medium text-gray-600 line-clamp-2 h-8 leading-tight">
                  {product.ProductName_Hindi || product.ProductName || 'Product'}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1.5">
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
          );
        })}
      </div>
    </section>
  );
}

// BZ TV Section
function BZTVSection() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const response = await api.getVideos(1, 6); // Get first 6 videos
      console.log('BZ TV Videos Response:', response);
      
      // Handle ProductsApiReponse.ShortVideosURLs structure
      const videoArray = response?.ProductsApiReponse?.ShortVideosURLs
                      || response?.data?.ProductsApiReponse?.ShortVideosURLs
                      || response?.ds?.Video
                      || response?.data?.Video
                      || response?.data?.Videos
                      || response?.Video
                      || response?.Videos
                      || (Array.isArray(response?.data) ? response.data : [])
                      || [];
      
      // Map to display format - use actual video IDs from API
      // Note: API doesn't provide Duration field, so we'll calculate it from video metadata or hide it
      const mappedVideos = (Array.isArray(videoArray) ? videoArray.slice(0, 6) : []).map((v: any, index: number) => ({
        id: v.Id || v.VideoId || v.ID || (index + 1), // Use actual Id from API
        title: v.VideoTitle || v.Title || v.Name || `Video ${index + 1}`,
        duration: v.Duration || v.duration || v.Time || null, // null if not available (will be calculated or hidden)
        views: v.Views || v.ViewCount || v.ViewsCount || '0',
        thumbnail: v.ThumbnailUrl || v.Thumbnail || v.ImageUrl,
        videoUrl: v.VideoUrls || v.VideoUrl, // Store video URL for duration calculation
      }));
      
      setVideos(mappedVideos.length > 0 ? mappedVideos : [
        { id: 1, title: 'Power Tiller कैसे चलाएं?', duration: '3:45', views: '12.5K' },
        { id: 2, title: 'Milking Machine Setup', duration: '5:20', views: '8.2K' },
        { id: 3, title: 'Chaff Cutter Maintenance', duration: '4:15', views: '6.8K' },
      ]);
    } catch (error) {
      console.error('Failed to load BZ TV videos:', error);
      // Fallback to default videos
      setVideos([
        { id: 1, title: 'Power Tiller कैसे चलाएं?', duration: '3:45', views: '12.5K' },
        { id: 2, title: 'Milking Machine Setup', duration: '5:20', views: '8.2K' },
        { id: 3, title: 'Chaff Cutter Maintenance', duration: '4:15', views: '6.8K' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="section-title-bz">🎬 BZ TV</h2>
        <Link href="/videos" className="text-emerald-600 text-sm font-semibold">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="min-w-[180px] max-w-[180px] bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-24 bg-gray-200"></div>
              <div className="p-2.5">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              duration={video.duration}
              views={video.views}
              thumbnail={video.thumbnail}
              videoUrl={video.videoUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// Help Strip
function HelpStrip() {
  return (
    <div className="mx-4 mb-4 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-4 flex items-center justify-between text-white">
      <div>
        <div className="font-semibold">🤝 मदद चाहिए?</div>
        <div className="text-sm opacity-90">हमारे expert से बात करें</div>
      </div>
      <a
        href={`tel:${APP_CONFIG.PHONE}`}
        className="bg-white text-emerald-700 px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <Phone className="w-4 h-4" />
        Call
      </a>
    </div>
  );
}

// WhatsApp Float
function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${APP_CONFIG.WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <MessageCircle className="w-6 h-6 text-white" fill="white" />
    </a>
  );
}

// Main Homepage
export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const response = await api.getTopSelling();
      console.log('API Response:', response);
      // Handle nested data structure: response.data.ProductsApiReponse.Product
      const productArray = response?.data?.ProductsApiReponse?.Product 
                        || response?.ProductsApiReponse?.Product 
                        || response?.data?.Product
                        || response?.Product
                        || [];
      console.log('Products found:', productArray.length);
      setProducts(productArray);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 page-with-nav">
      <Header cartCount={2} />
      <SearchBar />
      <HeroSection />
      <CombosSection />
      <CategoriesSection />
      <BusinessSection />
      <BestSellersSection products={products} />
      <BZTVSection />
      <HelpStrip />
      <WhatsAppFloat />
      <BottomNav />
    </div>
  );
}

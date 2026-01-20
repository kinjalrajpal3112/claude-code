'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import VideoCard from '@/components/VideoCard';
import { api } from '@/services/api';

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [durations, setDurations] = useState<Record<number, string>>({});

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoading(true);
    try {
      const response = await api.getVideos(1, 50);
      console.log('Videos API Response:', response);
      
      // Handle various response structures
      // IMPORTANT: API returns ProductsApiReponse.ShortVideosURLs
      const videoArray = response?.ProductsApiReponse?.ShortVideosURLs
                      || response?.data?.ProductsApiReponse?.ShortVideosURLs
                      || response?.ds?.Video 
                      || response?.data?.Video 
                      || response?.data?.Videos
                      || response?.data?.ShortVideosURLs
                      || response?.Video 
                      || response?.Videos
                      || response?.ShortVideosURLs
                      || (Array.isArray(response?.data) ? response.data : [])
                      || (Array.isArray(response) ? response : [])
                      || [];
      
      console.log('Extracted video array:', videoArray.length, 'videos');
      if (videoArray.length > 0) {
        console.log('First video structure:', JSON.stringify(videoArray[0], null, 2));
      }
      
      // Map API videos to display format
      // IMPORTANT: API returns VideoUrls (plural) not VideoUrl (singular)
      // Note: API doesn't provide Duration field, so we'll calculate it from video metadata
      const mappedVideos = videoArray.map((v: any, index: number) => ({
        id: v.Id || v.VideoId || v.ID || v.id || (index + 1),
        title: v.VideoTitle || v.Title || v.Name || `Video ${index + 1}`,
        duration: v.Duration || v.duration || v.Time || null, // null if not available (will be calculated)
        views: v.Views || v.ViewCount || v.ViewsCount || v.views || '0',
        category: v.HashTagName || v.Category || v.category || 'Video',
        videoUrl: v.VideoUrls || v.VideoUrl || v.VideoURL || v.URL || v.Url, // VideoUrls (plural) is the correct field
        thumbnail: v.ThumbnailUrl || v.Thumbnail || v.Thumbnail_URL || v.ImageUrl || v.Image_URL,
        description: v.VideoDescription || v.Description || v.description || '',
      }));
      
      setVideos(mappedVideos.length > 0 ? mappedVideos : getDefaultVideos());
    } catch (error) {
      console.error('Failed to load videos:', error);
      setVideos(getDefaultVideos());
    } finally {
      setLoading(false);
    }
  }

  function getDefaultVideos() {
    return [
      { id: 1, title: 'Power Tiller कैसे चलाएं?', duration: '3:45', views: '12.5K', category: 'Tutorial' },
      { id: 2, title: 'Milking Machine Setup Guide', duration: '5:20', views: '8.2K', category: 'Setup' },
      { id: 3, title: 'Chaff Cutter Maintenance Tips', duration: '4:15', views: '6.8K', category: 'Maintenance' },
      { id: 4, title: 'Spray Pump कैसे Use करें', duration: '6:30', views: '15.3K', category: 'Tutorial' },
      { id: 5, title: 'Poultry Farm Equipment Guide', duration: '8:45', views: '4.2K', category: 'Guide' },
      { id: 6, title: 'Tractor Attachment Tips', duration: '7:20', views: '9.1K', category: 'Tips' },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50 page-with-nav">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">🎬 BZ TV</h1>
        </div>
      </header>

      <div className="p-4">
        {loading ? (
          <div className="grid gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {videos.map(video => {
              const videoDuration = durations[video.id] || video.duration;
              return (
                <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-sm relative">
                  <Link
                    href={`/video/${video.id}`}
                    className="block"
                  >
                    <div className="w-full h-40 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-gray-900" fill="currentColor" />
                        </div>
                      )}
                      {videoDuration && videoDuration !== '0:00' && (
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{videoDuration}</span>
                      )}
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">{video.category}</span>
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/video/${video.id}`}>
                      <h3 className="font-semibold text-gray-900">{video.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{video.views} views</p>
                    </Link>
                  </div>
                  {/* Hidden video element to calculate duration */}
                  {video.videoUrl && !durations[video.id] && (
                    <video
                      preload="metadata"
                      src={video.videoUrl}
                      className="hidden"
                      crossOrigin="anonymous"
                      onLoadedMetadata={(e) => {
                        const target = e.target as HTMLVideoElement;
                        if (target.duration && isFinite(target.duration) && target.duration > 0) {
                          const mins = Math.floor(target.duration / 60);
                          const secs = Math.floor(target.duration % 60);
                          const formatted = `${mins}:${secs.toString().padStart(2, '0')}`;
                          setDurations(prev => ({ ...prev, [video.id]: formatted }));
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

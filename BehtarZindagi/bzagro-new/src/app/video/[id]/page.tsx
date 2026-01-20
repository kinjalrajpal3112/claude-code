'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Play,
  Pause,
  ThumbsUp,
  MessageCircle,
  Clock,
  Eye,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { APP_CONFIG } from '@/config/api';
import { api } from '@/services/api';

// Mock video data - fallback if API fails
const videoData: Record<number, any> = {
  1: {
    id: 1,
    title: 'Power Tiller कैसे चलाएं?',
    duration: '3:45',
    views: '12.5K',
    category: 'Tutorial',
    description: 'Learn how to properly operate and use a power tiller for agricultural purposes. This comprehensive guide covers safety, operation, and maintenance tips.',
    thumbnail: '🚜',
    likes: '234',
    comments: '18',
  },
  2: {
    id: 2,
    title: 'Milking Machine Setup',
    duration: '5:20',
    views: '8.2K',
    category: 'Setup',
    description: 'Step-by-step guide to setting up your milking machine for optimal performance. Includes installation, calibration, and first-use instructions.',
    thumbnail: '🥛',
    likes: '156',
    comments: '12',
  },
  3: {
    id: 3,
    title: 'Chaff Cutter Maintenance',
    duration: '4:15',
    views: '6.8K',
    category: 'Maintenance',
    description: 'Essential maintenance tips for your chaff cutter to ensure long-lasting performance. Learn about blade sharpening, cleaning, and troubleshooting.',
    thumbnail: '🌾',
    likes: '98',
    comments: '7',
  },
  4: {
    id: 4,
    title: 'Spray Pump कैसे Use करें',
    duration: '6:30',
    views: '15.3K',
    category: 'Tutorial',
    description: 'Complete guide on how to use a spray pump effectively for crop protection. Covers mixing, application techniques, and safety measures.',
    thumbnail: '🌿',
    likes: '312',
    comments: '24',
  },
  5: {
    id: 5,
    title: 'Poultry Farm Equipment Guide',
    duration: '8:45',
    views: '4.2K',
    category: 'Guide',
    description: 'Comprehensive overview of essential poultry farm equipment including feeders, drinkers, and housing systems.',
    thumbnail: '🐔',
    likes: '67',
    comments: '5',
  },
  6: {
    id: 6,
    title: 'Tractor Attachment Tips',
    duration: '7:20',
    views: '9.1K',
    category: 'Tips',
    description: 'Expert tips on using various tractor attachments for different agricultural tasks. Maximize your tractor\'s versatility.',
    thumbnail: '🚜',
    likes: '189',
    comments: '15',
  },
};

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = Number(params.id);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calculatedDuration, setCalculatedDuration] = useState<string | null>(null);

  useEffect(() => {
    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  async function loadVideo() {
    setLoading(true);
    try {
      // Try to fetch from API
      const response = await api.getVideos(1, 50);
      console.log('=== Video API Response (Full) ===');
      console.log(JSON.stringify(response, null, 2));
      
      // Handle various response structures - check all possible paths
      // IMPORTANT: API returns ProductsApiReponse.ShortVideosURLs (not ds.Video)
      let videos: any[] = [];
      
      if (Array.isArray(response)) {
        videos = response;
      } else if (response?.ProductsApiReponse?.ShortVideosURLs) {
        // ACTUAL API STRUCTURE: ProductsApiReponse.ShortVideosURLs
        videos = Array.isArray(response.ProductsApiReponse.ShortVideosURLs) 
          ? response.ProductsApiReponse.ShortVideosURLs 
          : [response.ProductsApiReponse.ShortVideosURLs];
      } else if (response?.data?.ProductsApiReponse?.ShortVideosURLs) {
        videos = Array.isArray(response.data.ProductsApiReponse.ShortVideosURLs) 
          ? response.data.ProductsApiReponse.ShortVideosURLs 
          : [response.data.ProductsApiReponse.ShortVideosURLs];
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          videos = response.data;
        } else if (response.data?.Video) {
          videos = Array.isArray(response.data.Video) ? response.data.Video : [response.data.Video];
        } else if (response.data?.Videos) {
          videos = Array.isArray(response.data.Videos) ? response.data.Videos : [response.data.Videos];
        } else if (response.data?.ShortVideosURLs) {
          videos = Array.isArray(response.data.ShortVideosURLs) ? response.data.ShortVideosURLs : [response.data.ShortVideosURLs];
        } else if (response.data?.data) {
          videos = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        }
      } else if (response?.Video) {
        videos = Array.isArray(response.Video) ? response.Video : [response.Video];
      } else if (response?.Videos) {
        videos = Array.isArray(response.Videos) ? response.Videos : [response.Videos];
      } else if (response?.ds?.Video) {
        // Handle ds.Video structure (from terminal output)
        videos = Array.isArray(response.ds.Video) ? response.ds.Video : [response.ds.Video];
      } else if (response?.ShortVideosURLs) {
        videos = Array.isArray(response.ShortVideosURLs) ? response.ShortVideosURLs : [response.ShortVideosURLs];
      }
      
      console.log('=== Extracted Videos Array ===');
      console.log('Count:', videos.length);
      console.log('First video structure:', videos[0] ? JSON.stringify(videos[0], null, 2) : 'No videos');
      console.log('All video IDs:', videos.map((v: any) => ({
        VideoId: v.VideoId,
        Id: v.Id,
        ID: v.ID,
        id: v.id,
        allKeys: Object.keys(v)
      })));
      
      // Find video by ID - try multiple ID fields
      // IMPORTANT: API returns Id (capital I) not VideoId
      let foundVideo = videos.find((v: any) => 
        v.Id === videoId ||  // API uses Id (capital I)
        v.VideoId === videoId || 
        v.ID === videoId ||
        v.id === videoId ||
        String(v.Id) === String(videoId) ||
        String(v.VideoId) === String(videoId) ||
        String(v.ID) === String(videoId)
      );
      
      // If not found by ID, try index-based (videoId 1 = first video, etc.)
      // This is a fallback for when home page uses sequential IDs
      if (!foundVideo && videoId > 0 && videos.length > 0) {
        const index = videoId - 1; // videoId 1 = index 0
        if (index >= 0 && index < videos.length) {
          foundVideo = videos[index];
          console.log('Using index-based matching:', index, 'for videoId:', videoId);
        }
      }
      
      console.log('=== Found Video ===');
      console.log(foundVideo ? JSON.stringify(foundVideo, null, 2) : 'NOT FOUND');
      
      if (foundVideo) {
        // Extract video URL from various possible fields - check all possible field names
        // IMPORTANT: API returns VideoUrls (plural) not VideoUrl (singular)
        let videoUrl = foundVideo.VideoUrls  // API returns VideoUrls (plural) - CHECK THIS FIRST
                      || foundVideo.VideoUrl 
                      || foundVideo.VideoURL
                      || foundVideo.Video_Url
                      || foundVideo.video_url
                      || foundVideo.videoUrl
                      || foundVideo.URL 
                      || foundVideo.Url
                      || foundVideo.url
                      || foundVideo.VideoPath
                      || foundVideo.Video_Path
                      || foundVideo.videoPath
                      || foundVideo.FileUrl
                      || foundVideo.File_URL
                      || foundVideo.MediaUrl
                      || foundVideo.Media_URL;
        
        // Normalize video URL - handle relative URLs
        if (videoUrl && !videoUrl.startsWith('http') && !videoUrl.startsWith('//')) {
          // If it's a relative URL, try to construct full URL
          if (videoUrl.startsWith('/')) {
            videoUrl = `https://behtarzindagi.in${videoUrl}`;
          } else {
            videoUrl = `https://behtarzindagi.in/${videoUrl}`;
          }
        }
        
        console.log('=== Extracted Video URL ===');
        console.log('Raw VideoUrls (plural):', foundVideo.VideoUrls || 'NOT FOUND');
        console.log('Raw VideoUrl (singular):', foundVideo.VideoUrl || 'NOT FOUND');
        console.log('Raw URL:', foundVideo.URL || 'NOT FOUND');
        console.log('Normalized Video URL:', videoUrl);
        console.log('All URL-related keys:', Object.keys(foundVideo).filter(k => 
          k.toLowerCase().includes('url') || 
          k.toLowerCase().includes('video') || 
          k.toLowerCase().includes('path') ||
          k.toLowerCase().includes('media')
        ));
        console.log('Full video object keys:', Object.keys(foundVideo));
        console.log('Full video object:', JSON.stringify(foundVideo, null, 2));
        
        setVideo({
          id: foundVideo.VideoId || foundVideo.Id || foundVideo.ID || foundVideo.id || videoId,
          title: foundVideo.VideoTitle || foundVideo.Title || foundVideo.Name || foundVideo.title || 'Video',
          videoUrl: videoUrl,
          thumbnail: foundVideo.ThumbnailUrl || foundVideo.Thumbnail || foundVideo.Thumbnail_URL || foundVideo.ImageUrl || foundVideo.Image_URL || foundVideo.thumbnail,
          duration: foundVideo.Duration || foundVideo.duration || foundVideo.Time || '0:00',
          views: foundVideo.Views || foundVideo.ViewCount || foundVideo.ViewsCount || foundVideo.views || '0',
          description: foundVideo.VideoDescription || foundVideo.Description || foundVideo.description || foundVideo.Desc || '',
          category: foundVideo.HashTagName || foundVideo.Category || foundVideo.category || foundVideo.Cat || 'Video',
          likes: foundVideo.Likes || foundVideo.LikeCount || foundVideo.likes || '0',
          comments: foundVideo.Comments || foundVideo.CommentCount || foundVideo.comments || '0',
        });
      } else if (videoData[videoId]) {
        // Fallback to mock data
        console.log('Using mock data for video:', videoId);
        setVideo(videoData[videoId]);
      } else {
        console.warn('Video not found in API or mock data. VideoId:', videoId);
        // Still set basic video info from mock data if available
        if (videoData[videoId]) {
          setVideo(videoData[videoId]);
        }
      }
    } catch (error) {
      console.error('Failed to load video:', error);
      // Fallback to mock data
      if (videoData[videoId]) {
        setVideo(videoData[videoId]);
      }
    } finally {
      setLoading(false);
    }
  }

  function togglePlay() {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  function toggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }

  function handleVideoClick() {
    togglePlay();
  }

  // Format duration from seconds to MM:SS
  function formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Calculate duration from video element
  function handleLoadedMetadata() {
    if (videoRef.current && videoRef.current.duration) {
      const duration = formatDuration(videoRef.current.duration);
      setCalculatedDuration(duration);
      // Update video state with calculated duration
      if (video) {
        setVideo({ ...video, duration });
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Video not found</p>
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
    <div className="min-h-screen bg-gray-900 page-with-nav">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-sm font-semibold text-white">BZ TV</span>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 text-xs">
          <strong>Debug:</strong> Video ID: {videoId} | Has URL: {video.videoUrl ? 'Yes' : 'No'} | URL: {video.videoUrl || 'N/A'}
        </div>
      )}

      {/* Video Player Area */}
      <div className="w-full aspect-video bg-black relative group">
        {video.videoUrl ? (
          (() => {
            // Check if it's a YouTube URL
            const isYouTube = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be');
            const isDirectVideo = video.videoUrl.match(/\.(mp4|webm|ogg|mov|avi|m3u8)(\?.*)?$/i);
            
            if (isYouTube) {
              // Extract YouTube video ID
              let videoId = '';
              const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
              const match = video.videoUrl.match(youtubeRegex);
              if (match) videoId = match[1];
              
              return (
                <div className="w-full h-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
              );
            } else if (isDirectVideo) {
              // Direct video URL (MP4, WebM, etc.)
              return (
                <>
                  <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="w-full h-full object-contain"
                    onClick={handleVideoClick}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onLoadedMetadata={handleLoadedMetadata}
                    muted={isMuted}
                    playsInline
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Play/Pause Overlay */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors cursor-pointer pointer-events-none"
                    onClick={togglePlay}
                  >
                    {!isPlaying && (
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors pointer-events-auto">
                        <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
                      </div>
                    )}
                  </div>

                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                      <button
                        onClick={togglePlay}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" fill="currentColor" />
                        ) : (
                          <Play className="w-5 h-5" fill="currentColor" />
                        )}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1"></div>
                      <button
                        onClick={() => videoRef.current?.requestFullscreen()}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              );
            } else {
              // Unknown format - show placeholder with link
              return (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                      <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
                    </div>
                    <span className="text-6xl block mb-2">{video.thumbnail || '🎬'}</span>
                    <p className="text-white/80 text-sm mb-4">Video format not supported</p>
                    <a
                      href={video.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Open Video
                    </a>
                  </div>
                </div>
              );
            }
          })()
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
              </div>
              <span className="text-6xl block mb-2">{video.thumbnail || '🎬'}</span>
              <p className="text-white/80 text-sm">Video URL not available</p>
            </div>
          </div>
        )}
        
        {/* Duration Badge - Show calculated duration or fallback */}
        {(calculatedDuration || (video.duration && video.duration !== '0:00')) && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{calculatedDuration || video.duration}</span>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="bg-white p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded mb-2">
              {video.category}
            </span>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              {video.title}
            </h1>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{video.views}</span>
          </div>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{video.likes}</span>
          </button>
          <div className="flex items-center gap-1.5 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{video.comments}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-4 mt-2">
        <h3 className="font-bold text-gray-900 mb-2">📝 Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {video.description}
        </p>
      </div>

      {/* Related Videos */}
      <div className="bg-white p-4 mt-2">
        <h3 className="font-bold text-gray-900 mb-3">🎬 Related Videos</h3>
        <div className="space-y-3">
          {Object.values(videoData)
            .filter((v: any) => v.id !== videoId)
            .slice(0, 3)
            .map((relatedVideo: any) => (
              <Link
                key={relatedVideo.id}
                href={`/video/${relatedVideo.id}`}
                className="flex gap-3 bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors"
              >
                <div className="w-32 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center relative flex-shrink-0">
                  <div className="w-8 h-8 bg-white/95 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                    {relatedVideo.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {relatedVideo.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{relatedVideo.views} views</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mx-4 mb-4 mt-4 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-4 text-white text-center">
        <p className="font-semibold mb-2">💡 Need More Help?</p>
        <p className="text-sm opacity-90 mb-3">Our experts can guide you through any agricultural equipment</p>
        <a
          href={`tel:${APP_CONFIG.PHONE}`}
          className="inline-block bg-white text-emerald-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Call Expert
        </a>
      </div>

      <BottomNav />
    </div>
  );
}

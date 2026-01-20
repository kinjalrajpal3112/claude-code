'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface VideoCardProps {
  id: number;
  title: string;
  duration?: string | null;
  views: string;
  thumbnail?: string;
  videoUrl?: string;
  className?: string;
}

// Format duration from seconds to MM:SS
function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function VideoCard({ id, title, duration, views, thumbnail, videoUrl, className = '' }: VideoCardProps) {
  const [calculatedDuration, setCalculatedDuration] = useState<string | null>(
    duration && duration !== '0:00' && duration !== '0' ? duration : null
  );

  // Calculate duration from video metadata if not provided
  useEffect(() => {
    if (videoUrl && !calculatedDuration) {
      // Create a hidden video element to load metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.crossOrigin = 'anonymous';
      video.src = videoUrl;
      
      const handleLoadedMetadata = () => {
        if (video.duration && isFinite(video.duration) && video.duration > 0) {
          const formatted = formatDuration(video.duration);
          if (formatted) {
            setCalculatedDuration(formatted);
          }
        }
        // Clean up
        video.src = '';
        video.load();
      };
      
      const handleError = () => {
        // If video fails to load metadata, keep duration as null
        video.src = '';
        video.load();
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
      
      // Try to load metadata
      video.load();
      
      // Cleanup
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
        video.src = '';
      };
    }
  }, [videoUrl, calculatedDuration]);

  return (
    <Link
      href={`/video/${id}`}
      className={`video-card min-w-[180px] max-w-[180px] bg-white rounded-xl overflow-hidden shadow-sm ${className}`}
    >
      <div className="w-full h-24 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center">
            <span className="text-sm">▶</span>
          </div>
        )}
        {calculatedDuration && (
          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
            {calculatedDuration}
          </span>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
          {title}
        </h3>
        <p className="text-[10px] text-gray-500 mt-1">{views} views</p>
      </div>
    </Link>
  );
}

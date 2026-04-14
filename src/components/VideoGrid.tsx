"use client";

import { useRef, useEffect, useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "djqp9n6lq";

type Video = {
  id: string;
  publicId: string;
  title: string;
};

const buildCloudinaryVideoUrl = (publicId: string) => {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload`;
  const transforms = ["f_auto", "q_auto"].join(",");

  return `${base}/${transforms}/${publicId}`;
};

const buildCloudinaryPosterUrl = (publicId: string) => {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload`;
  const transforms = ["f_jpg", "q_auto", "w_1200", "so_0"].join(",");

  return `${base}/${transforms}/${publicId}`;
};

export default function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch("/api/videos");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.details || data.error || "Failed to fetch videos",
          );
        }

        console.log("Fetched videos:", data.videos);
        setVideos(data.videos);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load videos";
        console.error("Video fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 aspect-video animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-white/10 rounded-2xl p-8 md:p-12 text-red-400/70 font-inter text-sm md:text-base tracking-[0.2em] uppercase space-y-4">
        <div>⚠️ {error}</div>
        <div className="text-white/40 text-xs md:text-sm not-uppercase font-light tracking-normal">
          Make sure:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Vercel environment variables are set correctly</li>
            <li>CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are configured</li>
            <li>Your Cloudinary account has uploaded videos</li>
          </ul>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="border border-white/10 rounded-2xl p-10 text-white/60 font-inter text-sm md:text-base tracking-[0.2em] uppercase">
        No videos found. Upload videos to your Cloudinary account.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            {...video}
            onClick={() => setSelectedVideo(video)}
          />
        ))}
      </div>
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}

type VideoCardProps = {
  publicId: string;
  title: string;
  onClick: () => void;
};

function VideoCard({ publicId, title, onClick }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleEnter = () => {
    if (!videoRef.current) return;
    void videoRef.current.play();
  };

  const handleLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out shadow-[0_8px_32px_rgba(0,0,0,0.5)] group-hover:bg-white/20 group-hover:border-white/40">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 text-white ml-1 drop-shadow-xl"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="auto"
        poster={buildCloudinaryPosterUrl(publicId)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="w-full aspect-video object-cover"
      >
        <source src={buildCloudinaryVideoUrl(publicId)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </button>
  );
}

type VideoModalProps = {
  video: Video;
  onClose: () => void;
};

function VideoModal({ video, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Log the video URL for debugging
    console.log("Playing video:", buildCloudinaryVideoUrl(video.publicId));

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, video.publicId]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
    >
      <div className="relative w-full max-w-6xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
          aria-label="Close video"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Video title */}
        <div className="mb-4 text-sm font-inter uppercase tracking-[0.25em] text-white/70">
          {video.title}
        </div>

        {/* Video player */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            className="w-full aspect-video object-cover bg-black"
            onError={(e) => {
              console.error("Video playback error:", e);
              console.error(
                "Video URL:",
                buildCloudinaryVideoUrl(video.publicId),
              );
            }}
          >
            <source src={buildCloudinaryVideoUrl(video.publicId)} />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

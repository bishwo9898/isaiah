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
        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }
        const data = await response.json();
        console.log("Fetched videos:", data.videos);
        setVideos(data.videos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load videos");
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
      <div className="border border-white/10 rounded-2xl p-10 text-red-400/70 font-inter text-sm md:text-base tracking-[0.2em] uppercase">
        Error: {error}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-4 left-4 z-10 text-sm font-inter uppercase tracking-[0.25em] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {title}
      </div>
      {/* Play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white ml-1"
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

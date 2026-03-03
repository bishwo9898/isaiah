"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "djqp9n6lq";

type Photo = {
  id: string;
  publicId: string;
  title: string;
};

const buildCloudinaryImageUrl = (publicId: string, width?: number) => {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  const transforms = width
    ? ["f_auto", "q_auto", `w_${width}`, "ar_1:1", "c_fill"].join(",")
    : ["f_auto", "q_auto"].join(",");

  return `${base}/${transforms}/${publicId}`;
};

const buildCloudinaryHighResUrl = (publicId: string) => {
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  const transforms = ["f_auto", "q_auto:best", "w_2000"].join(",");
  return `${base}/${transforms}/${publicId}`;
};

export default function PhotoGrid() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch("/api/photos");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.details || data.error || "Failed to fetch photos",
          );
        }

        console.log("Fetched photos:", data.photos);
        setPhotos(data.photos);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load photos";
        console.error("Photo fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    void fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 aspect-square animate-pulse"
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
            <li>Your Cloudinary account has uploaded photos</li>
          </ul>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="border border-white/10 rounded-2xl p-10 text-white/60 font-inter text-sm md:text-base tracking-[0.2em] uppercase">
        No photos found. Upload photos to your Cloudinary account.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            {...photo}
            onClick={() => setSelectedPhotoIndex(index)}
          />
        ))}
      </div>
      {selectedPhotoIndex !== null && (
        <PhotoModal
          photos={photos}
          currentIndex={selectedPhotoIndex}
          onClose={() => setSelectedPhotoIndex(null)}
          onNavigate={setSelectedPhotoIndex}
        />
      )}
    </>
  );
}

type PhotoCardProps = {
  publicId: string;
  title: string;
  onClick: () => void;
};

function PhotoCard({ publicId, title, onClick }: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] aspect-square"
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <span className="text-white/40 text-xs">Failed to load</span>
        </div>
      )}
      {/* Image */}
      <img
        src={buildCloudinaryImageUrl(publicId, 600)}
        alt={title}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
      />
    </button>
  );
}

type PhotoModalProps = {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

function PhotoModal({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const photo = photos[currentIndex];

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    // Handle escape key and arrow keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handlePrevious = () => {
    onNavigate(currentIndex === 0 ? photos.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex === photos.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Image */}
        <img
          src={buildCloudinaryHighResUrl(photo.publicId)}
          alt={photo.title}
          className="max-h-[90vh] max-w-[95vw] object-contain"
          onError={(e) => {
            console.error("Image failed to load:", photo.publicId);
          }}
        />

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all duration-200 z-10"
          aria-label="Previous photo"
        >
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all duration-200 z-10"
          aria-label="Next photo"
        >
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close photo"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Photo counter */}
        <div className="absolute bottom-8 right-8 text-xs font-inter text-white/70 tracking-widest">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}

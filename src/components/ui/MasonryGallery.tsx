"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { type MediaItem, isVideo } from "@/config";

export default function MasonryGallery({ items }: { items: MediaItem[] }) {
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="flex flex-col gap-1">
        {left.map((item, i) => (
          <GalleryItem key={item.src} item={item} index={i * 2} />
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {right.map((item, i) => (
          <GalleryItem key={item.src} item={item} index={i * 2 + 1} />
        ))}
      </div>
    </div>
  );
}

function GalleryItem({ item, index }: { item: MediaItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const video = isVideo(item);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, ease: "easeOut", delay: (index % 4) * 0.1 }}
      className="relative rounded-sm overflow-hidden"
    >
      {visible && (
        <>
          {video ? (
            <VideoPlayer item={item} reducedMotion={!!reducedMotion} />
          ) : (
            <div className="overflow-hidden">
              <img
                src={item.src}
                alt={item.caption || ""}
                className="w-full h-auto block mb-[-8%]"
                loading="lazy"
              />
            </div>
          )}
          {item.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 pointer-events-none">
              <p className="text-white text-xs">{item.caption}</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function VideoPlayer({
  item,
  reducedMotion,
}: {
  item: MediaItem;
  reducedMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  // Reduced motion: show poster only
  if (reducedMotion && item.poster) {
    return (
      <img
        src={item.poster}
        alt={item.caption || ""}
        className="w-full h-auto block"
        loading="lazy"
      />
    );
  }

  return (
    <div className="relative cursor-pointer overflow-hidden" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        muted={muted}
        playsInline
        preload="metadata"
        loop
        onEnded={() => setPlaying(false)}
        className="w-full h-auto block mb-[-8%]"
      />
      {/* Play overlay */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5 ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {/* Mute toggle */}
      {playing && (
        <button
          onClick={toggleMute}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center z-10"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

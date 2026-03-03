"use client";

import { useState } from "react";
import VideoGrid from "@/components/VideoGrid";
import PhotoGrid from "@/components/PhotoGrid";

const TABS = ["videos", "photos"] as const;

type Tab = (typeof TABS)[number];

export default function WorkSection() {
  const [activeTab, setActiveTab] = useState<Tab>("videos");

  return (
    <section
      id="work-section"
      className="px-8 md:px-16 lg:px-24 py-16 md:py-20"
    >
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <h2 className="text-sm md:text-base font-inter font-light tracking-[0.6em] text-white/70">
          WORK
        </h2>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs md:text-sm font-inter uppercase tracking-[0.25em] transition-all duration-300 rounded-full ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white/70 hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        {activeTab === "videos" ? <VideoGrid /> : <PhotoGrid />}
      </div>
    </section>
  );
}

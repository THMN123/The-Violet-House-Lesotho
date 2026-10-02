import React, { useState, useRef } from 'react';
import { SiteContent } from '../lib/contentStore';
import { LandingPageView } from './LandingPageView';
import {
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  Minimize2,
  RotateCcw,
  Battery,
  Signal,
  Check,
} from 'lucide-react';

interface LiveDevicePreviewProps {
  content: SiteContent;
  onClose?: () => void;
  isSplitView?: boolean;
}

type DeviceMode = 'mobile' | 'tablet' | 'laptop';

export const LiveDevicePreview: React.FC<LiveDevicePreviewProps> = ({
  content,
  onClose,
  isSplitView = false,
}) => {
  const [device, setDevice] = useState<DeviceMode>('mobile');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleResetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Device Toolbar */}
      <div className="h-14 px-4 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
              100% Exact Live Simulator
            </span>
            <span className="text-[10px] text-zinc-400 block font-mono">
              Scroll &amp; interact inside {device === 'mobile' ? 'iPhone 16 Pro' : device === 'tablet' ? 'iPad Air' : 'MacBook Pro'}
            </span>
          </div>
        </div>

        {/* Device Switcher Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              device === 'mobile'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="iPhone 16 Pro"
          >
            <Smartphone size={14} />
            <span className="hidden sm:inline">Phone</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              device === 'tablet'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="iPad Air"
          >
            <Tablet size={14} />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('laptop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              device === 'laptop'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="MacBook Pro"
          >
            <Laptop size={14} />
            <span className="hidden sm:inline">Laptop</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetScroll}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Scroll to top"
          >
            <RotateCcw size={14} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close preview"
            >
              <Minimize2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Viewport Canvas Area with realistic hardware shadows */}
      <div className="flex-1 bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 p-3 sm:p-6 overflow-y-auto flex items-center justify-center">
        {/* ==================== 1. MOBILE: IPHONE 16 PRO ==================== */}
        {device === 'mobile' && (
          <div className="relative flex flex-col items-center">
            {/* Side buttons */}
            <div className="absolute -left-[14px] top-28 w-[4px] h-10 bg-zinc-700 rounded-l-md" />
            <div className="absolute -left-[14px] top-44 w-[4px] h-14 bg-zinc-700 rounded-l-md" />
            <div className="absolute -left-[14px] top-62 w-[4px] h-14 bg-zinc-700 rounded-l-md" />
            <div className="absolute -right-[14px] top-36 w-[4px] h-20 bg-zinc-700 rounded-r-md" />

            {/* Titanium Chassis Frame */}
            <div className="w-[375px] h-[720px] rounded-[52px] p-[10px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border-2 border-zinc-600/50 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/10">
              {/* Inner bezel */}
              <div className="w-full h-full rounded-[42px] bg-black overflow-hidden flex flex-col relative">
                {/* Dynamic Island Pill */}
                <div className="h-8 bg-black w-full flex items-center justify-between px-7 pt-1 z-30 select-none flex-shrink-0">
                  <span className="text-[11px] font-semibold text-white font-mono">9:41</span>
                  <div className="w-24 h-6 bg-black rounded-full border border-zinc-800/80 flex items-center justify-end px-2 gap-1.5 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-blue-900" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={13} className="text-white" />
                  </div>
                </div>

                {/* SCROLLABLE SCREEN VIEWPORT (Contains 100% exact copy of the full website!) */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto scrollbar-none text-white bg-charcoal"
                >
                  <LandingPageView content={content} isPreview={true} />
                </div>

                {/* iPhone Home Indicator Bar */}
                <div className="h-5 bg-black w-full flex items-center justify-center flex-shrink-0 z-30">
                  <div className="w-32 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. TABLET: IPAD AIR ==================== */}
        {device === 'tablet' && (
          <div className="relative flex flex-col items-center">
            {/* iPad Chassis */}
            <div className="w-[620px] h-[720px] rounded-[40px] p-[12px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border-2 border-zinc-600/50 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/10">
              <div className="w-full h-full rounded-[30px] bg-black overflow-hidden flex flex-col relative">
                {/* Top iPad sensor */}
                <div className="h-6 bg-black w-full flex items-center justify-between px-6 pt-1 text-[11px] text-zinc-400 flex-shrink-0">
                  <span>9:41 AM</span>
                  <div className="w-2 h-2 rounded-full bg-zinc-800 mx-auto" />
                  <div className="flex items-center gap-1.5">
                    <Wifi size={13} />
                    <Battery size={14} />
                  </div>
                </div>

                {/* Scrollable Viewport inside iPad */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto scrollbar-none text-white bg-charcoal"
                >
                  <LandingPageView content={content} isPreview={true} />
                </div>

                {/* iPad Bottom bar */}
                <div className="h-4 bg-black w-full flex items-center justify-center flex-shrink-0">
                  <div className="w-36 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 3. LAPTOP: MACBOOK PRO ==================== */}
        {device === 'laptop' && (
          <div className="relative flex flex-col items-center w-full max-w-[820px]">
            {/* Display Lid Frame */}
            <div className="w-full h-[540px] rounded-t-2xl p-[6px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600/80 shadow-[0_25px_80px_-10px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
              <div className="w-full h-full rounded-t-xl bg-black overflow-hidden flex flex-col relative border border-white/10">
                {/* macOS Menu Bar + Camera Notch */}
                <div className="h-6 bg-zinc-950/90 border-b border-zinc-800 px-3 flex items-center justify-between text-[10px] text-zinc-400 flex-shrink-0 select-none">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-200 font-bold"></span>
                    <span className="font-semibold text-zinc-200">The Violet House</span>
                    <span className="hidden sm:inline">File</span>
                    <span className="hidden sm:inline">Edit</span>
                    <span className="hidden sm:inline">View</span>
                  </div>
                  {/* Camera notch cutout */}
                  <div className="w-20 h-3 bg-black rounded-b-lg border-b border-x border-zinc-800 mx-auto flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-950 border border-zinc-700" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi size={11} />
                    <span>Thu 9:41 AM</span>
                  </div>
                </div>

                {/* Scrollable Viewport inside MacBook Display */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-y-auto scrollbar-none text-white bg-charcoal"
                >
                  <LandingPageView content={content} isPreview={true} />
                </div>
              </div>
            </div>

            {/* Laptop Aluminum Bottom Deck with Trackpad notch */}
            <div className="w-[104%] h-5 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-b-xl border-t border-zinc-600 shadow-2xl flex items-center justify-center relative -mt-[1px]">
              <div className="w-24 h-1.5 bg-zinc-600 rounded-b-md" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

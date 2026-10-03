import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SiteContent } from '../lib/contentStore';
import { LandingPageView } from './LandingPageView';
import {
  Smartphone,
  Tablet,
  Laptop,
  RotateCcw,
  Minimize2,
  Wifi,
  Battery,
  Signal,
  Maximize2,
} from 'lucide-react';

interface LiveDevicePreviewProps {
  content: SiteContent;
  onClose?: () => void;
  isSplitView?: boolean;
}

type DeviceMode = 'mobile' | 'tablet' | 'laptop';

interface DeviceSpec {
  id: DeviceMode;
  name: string;
  label: string;
  viewportWidth: number;
  viewportHeight: number;
  chassisWidth: number;
  chassisHeight: number;
}

const DEVICE_SPECS: Record<DeviceMode, DeviceSpec> = {
  mobile: {
    id: 'mobile',
    name: 'iPhone 16 Pro',
    label: 'Phone',
    viewportWidth: 390,
    viewportHeight: 844,
    chassisWidth: 416,
    chassisHeight: 870,
  },
  tablet: {
    id: 'tablet',
    name: 'iPad Air',
    label: 'Tablet',
    viewportWidth: 768,
    viewportHeight: 1024,
    chassisWidth: 800,
    chassisHeight: 1056,
  },
  laptop: {
    id: 'laptop',
    name: 'MacBook Pro',
    label: 'Desktop',
    viewportWidth: 1280,
    viewportHeight: 800,
    chassisWidth: 1304,
    chassisHeight: 864,
  },
};

export const LiveDevicePreview: React.FC<LiveDevicePreviewProps> = ({
  content,
  onClose,
  isSplitView = false,
}) => {
  const [device, setDevice] = useState<DeviceMode>('mobile');
  const [zoomMode, setZoomMode] = useState<'fit' | '100%'>('fit');
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Iframe Portal Setup
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  // ResizeObserver to calculate auto-fit scale
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const spec = DEVICE_SPECS[device];

  // Calculate dynamic scale factor so device always fits available space with zero cutoff
  const padding = 32;
  const availW = Math.max(containerSize.width - padding, 240);
  const availH = Math.max(containerSize.height - padding, 240);
  const fitScale = Math.min(availW / spec.chassisWidth, availH / spec.chassisHeight, 1);
  const activeScale = zoomMode === 'fit' ? Math.max(fitScale, 0.2) : 1;

  // Sync styles into iframe document
  const syncStylesToIframe = (doc: Document) => {
    doc.head.innerHTML = `
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <base href="${window.location.origin}/" />
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background-color: #111113;
          color: #f4f4f5;
          font-family: 'Plus Jakarta Sans', sans-serif;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.35);
        }
      </style>
    `;

    // Clone all existing style and link tags from main document
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
      doc.head.appendChild(el.cloneNode(true));
    });

    doc.documentElement.className = 'dark';
    doc.body.className = 'bg-[#111113] text-zinc-100 m-0 p-0 antialiased overflow-x-hidden';
  };

  const handleIframeLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    syncStylesToIframe(doc);
    setMountNode(doc.body);
  };

  // Keep styles synchronized if main document head changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (iframeRef.current?.contentDocument) {
        syncStylesToIframe(iframeRef.current.contentDocument);
      }
    });
    observer.observe(document.head, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const handleResetScroll = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Device Toolbar */}
      <div className="h-14 px-4 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div>
            <span className="text-xs font-medium text-zinc-200 block">
              Device Preview
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {spec.label} · {spec.viewportWidth} × {spec.viewportHeight} · {Math.round(activeScale * 100)}%
            </span>
          </div>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              device === 'mobile'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Mobile (390 × 844)"
          >
            <Smartphone size={13} />
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
            title="Tablet (768 × 1024)"
          >
            <Tablet size={13} />
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
            title="Desktop (1280 × 800)"
          >
            <Laptop size={13} />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomMode(zoomMode === 'fit' ? '100%' : 'fit')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              zoomMode === 'fit'
                ? 'bg-zinc-800 text-zinc-200'
                : 'bg-violet-950/50 text-violet-300 border border-violet-800/40'
            }`}
            title={zoomMode === 'fit' ? 'Switch to actual 100% scale' : 'Switch to fit view'}
          >
            {zoomMode === 'fit' ? 'Fit' : '100%'}
          </button>

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

      {/* Viewport Canvas with Perfect Centering & Auto-fit Math */}
      <div
        ref={containerRef}
        className="flex-1 bg-[#09090b] p-4 overflow-auto flex items-center justify-center select-none"
      >
        {/* Outer Layout Footprint Sized to Scaled Dimensions */}
        <div
          style={{
            width: spec.chassisWidth * activeScale,
            height: spec.chassisHeight * activeScale,
          }}
          className="relative shrink-0 flex items-center justify-center transition-all duration-150 ease-out"
        >
          {/* Inner Native Chassis with Scale Transform applied from top-left */}
          <div
            style={{
              width: spec.chassisWidth,
              height: spec.chassisHeight,
              transform: `scale(${activeScale})`,
              transformOrigin: 'top left',
            }}
            className="absolute top-0 left-0"
          >
            {/* ==================== 1. MOBILE: IPHONE 16 PRO ==================== */}
            {device === 'mobile' && (
              <div className="relative w-[416px] h-[870px] rounded-[52px] p-[13px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600/70 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/10">
                {/* Physical buttons on bezel */}
                <div className="absolute -left-[3px] top-28 w-[3px] h-10 bg-zinc-600 rounded-l-sm" />
                <div className="absolute -left-[3px] top-44 w-[3px] h-14 bg-zinc-600 rounded-l-sm" />
                <div className="absolute -left-[3px] top-62 w-[3px] h-14 bg-zinc-600 rounded-l-sm" />
                <div className="absolute -right-[3px] top-36 w-[3px] h-20 bg-zinc-600 rounded-r-sm" />

                {/* Inner Screen Bezel */}
                <div className="w-[390px] h-[844px] rounded-[40px] bg-black overflow-hidden flex flex-col relative">
                  {/* Status Bar & Dynamic Island */}
                  <div className="h-11 bg-black w-full flex items-center justify-between px-7 pt-1 z-30 select-none flex-shrink-0">
                    <span className="text-[12px] font-semibold text-white font-mono tracking-tight">9:41</span>
                    <div className="w-28 h-7 bg-black rounded-full border border-zinc-800 flex items-center justify-end px-2.5 gap-2 shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-900" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-white">
                      <Signal size={12} />
                      <Wifi size={12} />
                      <Battery size={13} />
                    </div>
                  </div>

                  {/* Isolated Responsive Viewport (iframe with true 390px width) */}
                  <div className="flex-1 w-full overflow-hidden bg-[#111113]">
                    <iframe
                      ref={iframeRef}
                      key="mobile-preview"
                      onLoad={handleIframeLoad}
                      className="w-full h-full border-0 block"
                      title="Mobile View"
                    />
                  </div>

                  {/* Home Indicator */}
                  <div className="h-5 bg-black w-full flex items-center justify-center flex-shrink-0 z-30">
                    <div className="w-32 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 2. TABLET: IPAD AIR ==================== */}
            {device === 'tablet' && (
              <div className="relative w-[800px] h-[1056px] rounded-[36px] p-[16px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600/70 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden ring-1 ring-white/10">
                <div className="w-[768px] h-[1024px] rounded-[22px] bg-black overflow-hidden flex flex-col relative">
                  {/* iPad Status Bar */}
                  <div className="h-7 bg-black w-full flex items-center justify-between px-6 pt-1 text-[11px] text-zinc-400 flex-shrink-0 select-none">
                    <span>9:41 AM</span>
                    <div className="w-2 h-2 rounded-full bg-zinc-800 mx-auto" />
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Wifi size={12} />
                      <Battery size={13} />
                    </div>
                  </div>

                  {/* Isolated Responsive Viewport (iframe with true 768px width) */}
                  <div className="flex-1 w-full overflow-hidden bg-[#111113]">
                    <iframe
                      ref={iframeRef}
                      key="tablet-preview"
                      onLoad={handleIframeLoad}
                      className="w-full h-full border-0 block"
                      title="Tablet View"
                    />
                  </div>

                  {/* iPad Home Indicator */}
                  <div className="h-4 bg-black w-full flex items-center justify-center flex-shrink-0">
                    <div className="w-36 h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {/* ==================== 3. LAPTOP: MACBOOK PRO ==================== */}
            {device === 'laptop' && (
              <div className="relative w-[1304px] h-[864px] flex flex-col items-center">
                {/* Aluminum Display Lid */}
                <div className="w-[1304px] h-[840px] rounded-t-2xl p-[12px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 border border-zinc-600/80 shadow-[0_25px_80px_-10px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
                  <div className="w-[1280px] h-[816px] rounded-t-xl bg-black overflow-hidden flex flex-col relative border border-white/10">
                    {/* Modern Browser Chrome Window Bar */}
                    <div className="h-9 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-xs text-zinc-400 flex-shrink-0 select-none">
                      {/* Window Traffic Lights */}
                      <div className="flex items-center gap-2 w-24">
                        <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600" />
                      </div>

                      {/* Minimalist URL Address Pill */}
                      <div className="flex-1 max-w-md mx-auto h-6 bg-zinc-950 border border-zinc-800 rounded-lg px-3 flex items-center justify-center text-[11px] text-zinc-400 font-mono">
                        <span className="text-zinc-600 mr-1">https://</span>
                        <span className="text-zinc-300 font-medium">theviolethouse.ls</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 w-24 text-[11px] text-zinc-500">
                        <span>1280 × 800</span>
                      </div>
                    </div>

                    {/* Isolated Responsive Viewport (iframe with true 1280px width) */}
                    <div className="flex-1 w-full overflow-hidden bg-[#111113]">
                      <iframe
                        ref={iframeRef}
                        key="laptop-preview"
                        onLoad={handleIframeLoad}
                        className="w-full h-full border-0 block"
                        title="Desktop View"
                      />
                    </div>
                  </div>
                </div>

                {/* Laptop Bottom Aluminum Base & Notch */}
                <div className="w-[1330px] h-6 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-b-xl border-t border-zinc-600 shadow-2xl flex items-center justify-center relative -mt-[1px]">
                  <div className="w-32 h-1.5 bg-zinc-600 rounded-b-md" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Portal into Iframe Body when Document is Ready */}
      {mountNode &&
        createPortal(
          <LandingPageView content={content} isPreview={true} />,
          mountNode
        )}
    </div>
  );
};

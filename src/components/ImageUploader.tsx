import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Check, RefreshCw, X, FolderCheck } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  helperText?: string;
}

const PRESET_ESTATE_IMAGES = [
  { name: 'Official Logo Crest', path: '/images/logo.png', category: 'Brand' },
  { name: 'Pool Deck Luxury', path: '/images/new.jpeg', category: 'Hero & Exterior' },
  { name: 'Estate Architecture', path: '/images/image_0.png', category: 'Exterior' },
  { name: 'Royal Bedroom Suite', path: '/images/image_2.png', category: 'Suites' },
  { name: 'Contemporary Lounge', path: '/images/image_1.png', category: 'Suites' },
  { name: 'Pristine Pool Waters', path: '/images/image_11.png', category: 'Wellness' },
  { name: 'Poolside Lifestyle', path: '/images/image_12.png', category: 'Wellness' },
  { name: 'Intimate Dining Salon', path: '/images/image_3.png', category: 'Dining' },
  { name: 'Gourmet Starters Plate', path: '/images/image_6.png', category: 'Culinary' },
  { name: 'Atlantic Salmon Dish', path: '/images/WhatsApp Image 2026-05-17 at 17.36.56.jpeg', category: 'Culinary' },
  { name: 'Prime Beef Tenderloin', path: '/images/WhatsApp Image 2026-05-17 at 17.37.24.jpeg', category: 'Culinary' },
  { name: 'Decadent Berry Dessert', path: '/images/image_8.png', category: 'Culinary' },
  { name: 'Legacy Gala Event', path: '/images/image_9.png', category: 'Events' },
  { name: 'Architectural Details', path: '/images/image_5.png', category: 'Details' },
  { name: 'Estate Entrance Signage', path: '/images/image_4.png', category: 'Branding' },
];

/**
 * Compresses an image file client-side to prevent massive JSON payloads while maintaining crisp visual quality.
 */
function compressImage(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const elem = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to WebP or JPEG
        const dataUrl = elem.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image Asset',
  aspectRatio = '16:9',
  helperText,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'library' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStats, setUploadStats] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    try {
      setIsProcessing(true);
      const originalSizeKb = Math.round(file.size / 1024);
      const compressedDataUrl = await compressImage(file);
      const compressedSizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);

      setUploadStats(`Optimized from ${originalSizeKb} KB → ${compressedSizeKb} KB`);
      onChange(compressedDataUrl);
      setIsProcessing(false);
    } catch (err) {
      console.error('Image compression failed:', err);
      setIsProcessing(false);
      // Fallback: direct FileReader
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const aspectClass =
    aspectRatio === '1:1'
      ? 'aspect-square'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : 'aspect-video';

  return (
    <div className="space-y-3">
      {/* Label and mode switcher */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon size={13} className="text-violet-400" />
          {label}
        </label>

        {/* Tab pills */}
        <div className="inline-flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px]">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === 'upload'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Upload Device
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('library')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === 'library'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Estate Photos
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeMode === 'url'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Link / Path
          </button>
        </div>
      </div>

      {/* Preview Box & Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Preview Thumbnail */}
        <div className="sm:col-span-4 relative group">
          <div
            className={`relative ${aspectClass} max-h-44 rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-900 shadow-md group-hover:border-violet-500/60 transition-all`}
          >
            {value ? (
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 p-4 text-center">
                <ImageIcon size={28} className="mb-2 stroke-1" />
                <span className="text-[10px] uppercase font-mono">No Image</span>
              </div>
            )}

            {/* Quick overlay controls */}
            {value && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-white text-[10px] font-medium border border-zinc-600 hover:bg-zinc-700 transition-colors shadow-sm"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900 transition-colors shadow-sm"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          {uploadStats && (
            <div className="text-[9px] text-emerald-400 mt-1 font-mono">{uploadStats}</div>
          )}
        </div>

        {/* Interactive Mode Body */}
        <div className="sm:col-span-8">
          {/* 1. Direct Device Upload Mode */}
          {activeMode === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-violet-500 bg-violet-950/30 text-violet-200 scale-[0.99]'
                  : 'border-zinc-700/80 hover:border-zinc-500 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              {isProcessing ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <RefreshCw size={24} className="animate-spin text-violet-400" />
                  <span className="text-xs font-medium text-violet-300">
                    Optimizing &amp; Compressing...
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-sm">
                    <Upload size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-100">
                      Tap or Drag file here to upload from device
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Supports PNG, JPG, WebP, HEIC (Auto-optimized for instant zero-lag loading)
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 2. Estate Photo Gallery Picker Mode */}
          {activeMode === 'library' && (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 max-h-48 overflow-y-auto space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1">
                <FolderCheck size={12} className="text-violet-400" />
                Select from Curated Estate Assets ({PRESET_ESTATE_IMAGES.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_ESTATE_IMAGES.map((img) => {
                  const isSelected = value === img.path;
                  return (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => onChange(img.path)}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all group ${
                        isSelected
                          ? 'border-violet-500 bg-violet-950/40 text-violet-200'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 text-zinc-300'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-white/10">
                        <img
                          src={img.path}
                          alt={img.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium truncate">{img.name}</div>
                        <div className="text-[9px] text-zinc-500 truncate">{img.category}</div>
                      </div>
                      {isSelected && <Check size={14} className="text-violet-400 mr-1 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Direct URL / Path Mode */}
          {activeMode === 'url' && (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="/images/example.jpg or https://..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-violet-500 pl-9"
                />
                <LinkIcon size={14} className="absolute left-3 top-3 text-zinc-500" />
              </div>
              <p className="text-[10px] text-zinc-500">
                You can paste a relative path or an HTTPS public image URL directly.
              </p>
            </div>
          )}
        </div>
      </div>

      {helperText && <p className="text-[10px] text-zinc-500">{helperText}</p>}
    </div>
  );
};

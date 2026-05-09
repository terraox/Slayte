import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ArrowLeft, Download, Loader2, Trash2, Check, X } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ModeToggle } from '@/components/mode-toggle';
import './ExportSizes.css';

const PRESET_SIZES = [
  { id: 'ig-square',      name: 'Instagram Square',  width: 1080, height: 1080, aspect: '1:1'  },
  { id: 'ig-portrait',    name: 'Instagram Portrait', width: 1080, height: 1350, aspect: '4:5'  },
  { id: 'ig-story',       name: 'Instagram Story',    width: 1080, height: 1920, aspect: '9:16' },
  { id: 'yt-thumb',       name: 'YouTube Thumbnail',  width: 1280, height: 720,  aspect: '16:9' },
  { id: 'twitter-header', name: 'Twitter Header',     width: 1500, height: 500,  aspect: '3:1'  },
  { id: 'linkedin-cover', name: 'LinkedIn Cover',     width: 1584, height: 396,  aspect: '4:1'  },
];

// MAX display bounding box for the aspect ratio shape
const BOX_MAX_W = 110;
const BOX_MAX_H = 72;

function getBoxDims(w, h) {
  const scale = Math.min(BOX_MAX_W / w, BOX_MAX_H / h);
  return { bw: Math.round(w * scale), bh: Math.round(h * scale) };
}

export default function ExportSizesPage({ onBack, onNavigate }) {
  const [files, setFiles]           = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(['ig-square', 'yt-thumb']);
  const [isHovering, setIsHovering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);
  const activeUrls   = useRef(new Set());

  useEffect(() => {
    const urls = activeUrls.current;
    return () => { urls.forEach(u => URL.revokeObjectURL(u)); urls.clear(); };
  }, []);

  useEffect(() => {
    document.title = 'Export Sizes — Slayte';
    return () => { document.title = 'Slayte'; };
  }, []);

  const handleFiles = useCallback((raw) => {
    const valid = Array.from(raw)
      .filter(f => f.type.startsWith('image/'))
      .map(file => {
        const url = URL.createObjectURL(file);
        activeUrls.current.add(url);
        return { file, previewUrl: url, id: Math.random().toString(36).substr(2, 9), name: file.name };
      });
    setFiles(prev => [...prev, ...valid]);
  }, []);

  const removeFile = id => {
    setFiles(prev => {
      const hit = prev.find(f => f.id === id);
      if (hit) { URL.revokeObjectURL(hit.previewUrl); activeUrls.current.delete(hit.previewUrl); }
      return prev.filter(f => f.id !== id);
    });
  };

  const toggleSize = id =>
    setSelectedSizes(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const loadImage = url => new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });

  const exportImages = async () => {
    if (!files.length || !selectedSizes.length) return;
    setIsExporting(true);
    try {
      for (const fo of files) {
        const img = await loadImage(fo.previewUrl);
        for (const sid of selectedSizes) {
          const p = PRESET_SIZES.find(s => s.id === sid);
          if (!p) continue;
          const cv = document.createElement('canvas');
          cv.width = p.width; cv.height = p.height;
          const ctx = cv.getContext('2d');
          const sc = Math.max(p.width / img.width, p.height / img.height);
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, p.width, p.height);
          ctx.drawImage(img, (p.width - img.width * sc) / 2, (p.height - img.height * sc) / 2, img.width * sc, img.height * sc);
          const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', 0.92));
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement('a');
          a.href = url; a.download = `${fo.name.split('.')[0]}_${p.id}.jpg`;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          await new Promise(r => setTimeout(r, 100));
          URL.revokeObjectURL(url);
        }
      }
    } catch (e) { console.error('Export failed:', e); }
    finally { setIsExporting(false); }
  };

  const totalVariants = files.length * selectedSizes.length;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">

      {/* ── Navbar ── */}
      <nav className="flex-shrink-0 h-14 px-6 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-7">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          {onNavigate && (
            <>
              <div className="w-px h-5 bg-border" />
              <button
                onClick={() => onNavigate('upload')}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Thumbnail
              </button>
              <span className="relative text-[13px] font-semibold text-foreground cursor-default">
                Export Sizes
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-primary rounded-full" />
              </span>
              <button
                onClick={() => onNavigate('email')}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Email Builder
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {selectedSizes.length > 0 && (
              <motion.span
                key="sel"
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                className="text-[12px] text-muted-foreground tabular-nums"
              >
                {selectedSizes.length}&nbsp;of&nbsp;{PRESET_SIZES.length}&nbsp;selected
              </motion.span>
            )}
          </AnimatePresence>
          <ModeToggle />
          <ShimmerButton disabled={totalVariants === 0 || isExporting} onClick={exportImages} className="h-8 px-4">
            {isExporting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
            <span className="text-[13px] font-medium">
              {isExporting ? 'Exporting…' : totalVariants > 0 ? `Export ${totalVariants}` : 'Export'}
            </span>
          </ShimmerButton>
        </div>
      </nav>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          <BlurFade delay={0.05}>
            <input type="file" ref={fileInputRef} multiple accept="image/*" className="hidden"
              onChange={e => handleFiles(e.target.files)} />

            {files.length === 0 ? (
              /* ── Empty state: full centered hero dropzone ── */
              <div className="es-hero-wrapper">
                <div className="es-hero-content">
                  <h1 className="es-hero-headline">Export Sizes</h1>
                  <p className="es-hero-tagline">Resize your images to every platform in one click</p>
                  <div
                    className={`es-dropzone es-dropzone--hero${isHovering ? ' es-dropzone--active' : ''}`}
                    onDragOver={e => { e.preventDefault(); setIsHovering(true); }}
                    onDragLeave={() => setIsHovering(false)}
                    onDrop={e => { e.preventDefault(); setIsHovering(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <BorderBeam size={100} duration={10} colorFrom="#7c3aed" colorTo="#5DCAA5" />
                    <div className="es-dropzone-icon es-dropzone-icon--lg">
                      <UploadCloud size={32} strokeWidth={1.5} className="text-muted-foreground" />
                    </div>
                    <p className="es-dropzone-title es-dropzone-title--lg">Drop images here</p>
                    <p className="es-dropzone-sub">Drag & drop or click to browse · JPG, PNG, WEBP, SVG</p>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Filled state: upload bar + sizes ── */
              <>
                {/* Upload bar */}
                <div
                  className={`es-upload-filled${isHovering ? ' es-upload-filled--active' : ''}`}
                  onDragOver={e => { e.preventDefault(); setIsHovering(true); }}
                  onDragLeave={() => setIsHovering(false)}
                  onDrop={e => { e.preventDefault(); setIsHovering(false); handleFiles(e.dataTransfer.files); }}
                >
                  <div className="es-filled-left">
                    <div className="es-filled-thumb">
                      <img src={files[0].previewUrl} alt={files[0].name} />
                      {files.length > 1 && (
                        <span className="es-filled-badge">+{files.length - 1}</span>
                      )}
                    </div>
                    <div className="es-filled-meta">
                      <p className="es-filled-filename">{files[0].name}</p>
                      <p className="es-filled-filesize">
                        {(files[0].file.size / 1024).toFixed(0)} KB
                        {files.length > 1 && <span className="es-filled-more"> · {files.length} images</span>}
                      </p>
                    </div>
                    <button
                      className="es-filled-remove"
                      onClick={() => removeFile(files[0].id)}
                      aria-label="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <button
                    className="es-filled-add"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14">
                      <line x1="8" y1="2" x2="8" y2="14" /><line x1="2" y1="8" x2="14" y2="8" />
                    </svg>
                    <span>Add more</span>
                  </button>
                </div>

                {/* ── Size cards grid ── */}
                <BlurFade delay={0.15}>
                  <div className="es-section-header">
                    <div>
                      <h2 className="es-section-title">Export Sizes</h2>
                      <p className="es-section-sub">Choose the formats to export</p>
                    </div>
                    <span className="es-selected-count">
                      {selectedSizes.length} / {PRESET_SIZES.length} selected
                    </span>
                  </div>
                  <div className="es-sizes-grid">
                    {PRESET_SIZES.map((size, idx) => {
                      const active = selectedSizes.includes(size.id);
                      const { bw, bh } = getBoxDims(size.width, size.height);
                      return (
                        <motion.button
                          key={size.id}
                          onClick={() => toggleSize(size.id)}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * idx }}
                          className={`es-size-card${active ? ' es-selected' : ''}`}
                        >
                          {active ? (
                            <span className="es-check" aria-hidden="true">
                              <svg viewBox="0 0 12 12">
                                <polyline points="2,6 5,9 10,3" />
                              </svg>
                            </span>
                          ) : (
                            <span className="es-check-empty" aria-hidden="true" />
                          )}
                          <div className="es-aspect-box-wrapper">
                            <div
                              className="es-aspect-box"
                              style={{ width: bw, height: bh }}
                            />
                          </div>
                          <p className="es-size-name">{size.name}</p>
                          <p className="es-size-dims">{size.width} × {size.height}</p>
                          <span className="es-ratio-badge">{size.aspect}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </BlurFade>

                {/* ── Export summary bar ── */}
                <AnimatePresence>
                  {totalVariants > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="flex items-center justify-between px-5 py-4 rounded-2xl border border-border bg-card/50"
                    >
                      <p className="text-[13px] text-muted-foreground">
                        <span className="text-foreground font-semibold">{files.length}</span> image{files.length !== 1 ? 's' : ''}
                        <span className="mx-2 text-border">×</span>
                        <span className="text-foreground font-semibold">{selectedSizes.length}</span> size{selectedSizes.length !== 1 ? 's' : ''}
                        <span className="mx-2 text-border">=</span>
                        <span className="text-foreground font-semibold">{totalVariants}</span> file{totalVariants !== 1 ? 's' : ''}
                      </p>
                      <ShimmerButton disabled={isExporting} onClick={exportImages} className="h-8 px-4 ml-4">
                        {isExporting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                        <span className="text-[13px] font-medium">{isExporting ? 'Exporting…' : 'Export All'}</span>
                      </ShimmerButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </BlurFade>


          <div className="h-6" />
        </div>
      </div>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at center, #3b0764 0%, transparent 65%)', opacity: 0.15 }} />
      </div>
    </div>
  );
}

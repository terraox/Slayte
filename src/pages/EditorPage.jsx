import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Download, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { SlayteLogo } from '@/components/SlayteLogo';
import { removeBackground } from '@imgly/background-removal';
import { ModeToggle } from '@/components/mode-toggle';

const FONTS = [
  'Inter', 'Roboto', 'Oswald', 'Bebas Neue', 'Montserrat',
  'Poppins', 'Playfair Display', 'Arial', 'Impact', 'Georgia',
  'Courier New', 'Comic Sans MS'
];

// Load Google Fonts dynamically
const loadedFonts = new Set();
function ensureFontLoaded(fontFamily) {
  if (loadedFonts.has(fontFamily)) return;
  const systemFonts = ['Arial', 'Impact', 'Georgia', 'Courier New', 'Comic Sans MS'];
  if (systemFonts.includes(fontFamily)) return;
  loadedFonts.add(fontFamily);
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

const defaultLayer = {
  text: "YOUR TEXT",
  fontFamily: "Inter",
  fontSize: 80,
  fontWeight: 700,
  color: "#ffffff",
  opacity: 100,
  rotation: 0,
  x: 50,
  y: 50,
  letterSpacing: 0,
  dropShadow: false,
  textAboveImage: false,
};

// Reusable slider row — value and onChange work with plain numbers
function SliderRow({ label, value, unit = '', min, max, step = 1, onChange }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-[11px] tabular-nums text-muted-foreground font-mono bg-card border border-border px-1.5 py-0.5 rounded">{value}{unit}</span>
      </div>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onChange}
      />
    </div>
  );
}

export default function EditorPage({ image, onLeave }) {
  const [layers, setLayers] = useState([]);
  const [expandedLayer, setExpandedLayer] = useState(null);
  const [subjectImageUrl, setSubjectImageUrl] = useState(null);
  const [isProcessingSubject, setIsProcessingSubject] = useState(false);
  const canvasRef = useRef(null);
  const [imgDims, setImgDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (image?.url) {
      const processImage = async () => {
        setIsProcessingSubject(true);
        try {
          const blob = await removeBackground(image.url);
          const url = URL.createObjectURL(blob);
          setSubjectImageUrl(url);
        } catch (err) {
          console.error("Background removal failed:", err);
        } finally {
          setIsProcessingSubject(false);
        }
      };
      processImage();
    }
  }, [image]);

  const addLayer = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newLayer = { ...defaultLayer, id, text: `TEXT ${layers.length + 1}` };
    ensureFontLoaded(newLayer.fontFamily);
    setLayers(prev => [...prev, newLayer]);
    setExpandedLayer(id);
  };

  const updateLayer = useCallback((id, key, value) => {
    if (key === 'fontFamily') ensureFontLoaded(value);
    setLayers(prev => prev.map(l => l.id === id ? { ...l, [key]: value } : l));
  }, []);

  const removeLayer = (id) => {
    setLayers(prev => prev.filter(l => l.id !== id));
    if (expandedLayer === id) setExpandedLayer(null);
  };

  const resetCanvas = () => {
    setLayers([]);
    setExpandedLayer(null);
  };

  // Separate layers for z-index ordering — defined here so handleDownload can access them
  const belowLayers = layers.filter(l => !l.textAboveImage);
  const aboveLayers = layers.filter(l => l.textAboveImage);

  const handleDownload = async () => {
    const container = canvasRef.current;
    if (!container) return;

    const images = Array.from(container.querySelectorAll('img'));
    const baseImg = images[0];
    if (!baseImg) return;
    
    // subject image if available
    const subjectImg = subjectImageUrl ? images[1] : null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;

    // Draw layers helper
    const drawText = (layerList) => {
      layerList.forEach(layer => {
        ctx.save();
        const lx = (layer.x / 100) * canvas.width;
        const ly = (layer.y / 100) * canvas.height;
        ctx.translate(lx, ly);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.font = `${layer.fontWeight} ${layer.fontSize * (canvas.width / baseImg.clientWidth)}px "${layer.fontFamily}", sans-serif`;
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.opacity / 100;
        ctx.letterSpacing = `${layer.letterSpacing * (canvas.width / baseImg.clientWidth)}px`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (layer.dropShadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.85)';
          ctx.shadowBlur = 10 * (canvas.width / baseImg.clientWidth);
          ctx.shadowOffsetX = 3 * (canvas.width / baseImg.clientWidth);
          ctx.shadowOffsetY = 3 * (canvas.width / baseImg.clientWidth);
        }
        ctx.fillText(layer.text, 0, 0);
        ctx.restore();
      });
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Layer 1: Base Image
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
    
    // Layer 2: Text below subject
    drawText(belowLayers);

    // Layer 3: Subject mask
    if (subjectImg) {
      ctx.drawImage(subjectImg, 0, 0, canvas.width, canvas.height);
    }

    // Layer 4: Text above subject
    drawText(aboveLayers);

    const link = document.createElement('a');
    link.download = 'slayte-thumbnail.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toggleExpand = (id) => {
    setExpandedLayer(prev => prev === id ? null : id);
  };

  // (belowLayers/aboveLayers computed above, before handleDownload)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">

      {/* ─── HEADER ─── */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-5">
          <button
            onClick={onLeave}
            className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="w-px h-5 bg-border" />
          <SlayteLogo size={22} />
        </div>

        <div className="flex items-center gap-2.5">
          <ModeToggle />
          <div className="w-px h-5 bg-border mx-1" />
          <button
            onClick={resetCanvas}
            className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12px] font-medium text-muted-foreground border border-border bg-muted/50 hover:bg-muted hover:text-foreground transition-all">
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-[12px] font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-md shadow-purple-900/30">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </header>

      {/* ─── WORKSPACE ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto relative bg-secondary">
          {/*
            All layers (base image, text, subject mask) are absolutely stacked
            inside a single relative container sized by an invisible placeholder img.
            This guarantees a single stacking context so z-index ordering is reliable.
          */}
          <div
            ref={canvasRef}
            className="relative shadow-2xl shadow-black/50 rounded-lg overflow-hidden"
            style={{ maxWidth: '80vw', maxHeight: '78vh', display: 'inline-block' }}
          >
            {/* Invisible placeholder — drives the container's natural dimensions */}
            <img
              src={image.url}
              alt=""
              aria-hidden="true"
              className="block w-auto h-auto max-h-[78vh] object-contain"
              style={{ visibility: 'hidden', display: 'block' }}
              onLoad={e => setImgDims({ w: e.target.clientWidth, h: e.target.clientHeight })}
            />

            {/* z-index 0 — Base Image */}
            <img
              src={image.url}
              alt="Canvas"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ zIndex: 0 }}
              crossOrigin="anonymous"
            />

            {/* z-index 1 — Text layers rendered BEHIND the subject */}
            {belowLayers.map(layer => (
              <TextOverlay key={layer.id} layer={layer} zIndex={1} />
            ))}

            {/* z-index 2 — Subject Mask (bg-removed image) */}
            {subjectImageUrl && (
              <img
                src={subjectImageUrl}
                alt="Subject Mask"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ zIndex: 2 }}
                crossOrigin="anonymous"
              />
            )}

            {/* z-index 3 — Text layers rendered ABOVE the subject */}
            {aboveLayers.map(layer => (
              <TextOverlay key={layer.id} layer={layer} zIndex={3} />
            ))}
          </div>

          {/* Processing Indicator */}
          {isProcessingSubject && (
            <div className="absolute top-6 right-6 flex items-center gap-2.5 px-4 py-2 bg-card backdrop-blur-md rounded-full border border-border text-foreground shadow-xl z-50">
               <span className="w-3 h-3 border-2 border-[#555] border-t-white rounded-full animate-spin"></span>
               <span className="text-[12px] font-medium text-muted-foreground">Extracting subject mask...</span>
            </div>
          )}
        </div>

        {/* ─── SIDEBAR ─── */}
        <div className="w-[380px] flex flex-col flex-shrink-0 border-l border-border overflow-hidden bg-card">

          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight">Text Layers</h2>
              <span className="text-[11px] text-muted-foreground tabular-nums">{layers.length} layer{layers.length !== 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={addLayer}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-muted-foreground border border-border bg-card hover:bg-muted hover:border-border transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Text
            </button>
          </div>

          {/* Layers List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {layers.map((layer, idx) => (
                <motion.div
                  key={layer.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-border"
                >
                  {/* Layer Header — outer must be div (not button) to avoid invalid nested-button HTML */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpand(layer.id)}
                    onKeyDown={e => e.key === 'Enter' && toggleExpand(layer.id)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-card transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${expandedLayer === layer.id ? 'rotate-90' : ''}`} />
                      <span className="text-[13px] font-medium text-muted-foreground truncate">
                        {layer.text || 'Empty'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }}
                      className="p-1 rounded hover:bg-red-500/10 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>

                  {/* Expanded Controls */}
                  <AnimatePresence>
                    {expandedLayer === layer.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 space-y-5">

                          {/* Text Input */}
                          <div className="space-y-2">
                            <span className="text-[13px] font-medium text-muted-foreground">Text</span>
                            <Input
                              value={layer.text}
                              onChange={(e) => updateLayer(layer.id, 'text', e.target.value)}
                              className="h-10 text-[14px] bg-card border-border rounded-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#7c3aed]/50 focus-visible:border-[#7c3aed]/30"
                            />
                          </div>

                          {/* Font Family */}
                          <div className="space-y-2">
                            <span className="text-[13px] font-medium text-muted-foreground">Font Family</span>
                            <Select value={layer.fontFamily} onValueChange={(val) => updateLayer(layer.id, 'fontFamily', val)}>
                              <SelectTrigger className="h-10 text-[13px] bg-card border-border rounded-lg text-muted-foreground">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover border-border text-foreground">
                                {FONTS.map(f => (
                                  <SelectItem key={f} value={f} className="text-[13px] focus:bg-muted" style={{ fontFamily: f }}>
                                    {f}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Font Size */}
                          <SliderRow
                            label="Font Size"
                            value={layer.fontSize}
                            unit="px"
                            min={8}
                            max={600}
                            onChange={(v) => updateLayer(layer.id, 'fontSize', v)}
                          />

                          {/* Font Weight */}
                          <SliderRow
                            label="Font Weight"
                            value={layer.fontWeight}
                            min={100}
                            max={900}
                            step={100}
                            onChange={(v) => updateLayer(layer.id, 'fontWeight', v)}
                          />

                          {/* Color */}
                          <ColorPicker
                            value={layer.color}
                            onChange={(v) => updateLayer(layer.id, 'color', v)}
                          />

                          {/* Opacity */}
                          <SliderRow
                            label="Opacity"
                            value={layer.opacity}
                            unit="%"
                            min={0}
                            max={100}
                            onChange={(v) => updateLayer(layer.id, 'opacity', v)}
                          />

                          {/* Rotation */}
                          <SliderRow
                            label="Rotation"
                            value={layer.rotation}
                            unit="°"
                            min={-180}
                            max={180}
                            onChange={(v) => updateLayer(layer.id, 'rotation', v)}
                          />

                          {/* Horizontal Position */}
                          <SliderRow
                            label="Horizontal Position"
                            value={layer.x}
                            unit="%"
                            min={-20}
                            max={120}
                            onChange={(v) => updateLayer(layer.id, 'x', v)}
                          />

                          {/* Vertical Position */}
                          <SliderRow
                            label="Vertical Position"
                            value={layer.y}
                            unit="%"
                            min={-20}
                            max={120}
                            onChange={(v) => updateLayer(layer.id, 'y', v)}
                          />

                          {/* Letter Spacing */}
                          <SliderRow
                            label="Letter Spacing"
                            value={layer.letterSpacing}
                            unit="px"
                            min={-10}
                            max={60}
                            onChange={(v) => updateLayer(layer.id, 'letterSpacing', v)}
                          />

                          {/* Toggles */}
                          <div className="space-y-1 pt-3 mt-1 border-t border-border">
                            <div className="flex items-center justify-between py-2.5">
                              <span className="text-[13px] font-medium text-muted-foreground">Drop Shadow</span>
                              <Switch
                                checked={layer.dropShadow}
                                onCheckedChange={(val) => updateLayer(layer.id, 'dropShadow', val)}
                                checkedColor="#7c3aed"
                              />
                            </div>
                            <div className="flex items-center justify-between py-2.5">
                              <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-muted-foreground">Layering</span>
                                <span className="text-[10px] font-medium" style={{
                                  color: isProcessingSubject ? '#f59e0b' : (subjectImageUrl ? '#5DCAA5' : '#555')
                                }}>
                                  {isProcessingSubject
                                    ? 'EXTRACTING SUBJECT…'
                                    : layer.textAboveImage
                                      ? 'ABOVE SUBJECT'
                                      : subjectImageUrl
                                        ? 'BEHIND SUBJECT'
                                        : 'NO SUBJECT'}
                                </span>
                              </div>
                              <Switch
                                checked={layer.textAboveImage}
                                onCheckedChange={(val) => updateLayer(layer.id, 'textAboveImage', val)}
                                checkedColor="#5DCAA5"
                                disabled={isProcessingSubject || !subjectImageUrl}
                              />
                            </div>

                            {/* Processing hint — only visible while subject is being extracted */}
                            <AnimatePresence>
                              {isProcessingSubject && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex items-start gap-2.5 mt-1 mb-1 px-3 py-2.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06]">
                                    <span className="mt-[1px] w-3 h-3 flex-shrink-0 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin" />
                                    <p className="text-[11px] leading-relaxed text-amber-400/80">
                                      Extracting the subject from your image. The Layering toggle will unlock once this is done.
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {layers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center mb-3">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  No text layers yet.<br />Click "Add Text" to start.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(128,128,128,0.4); }
      `}} />
    </div>
  );
}

// Text overlay component
function TextOverlay({ layer, zIndex = 0 }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${layer.y}%`,
        left: `${layer.x}%`,
        transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
        fontFamily: `"${layer.fontFamily}", sans-serif`,
        fontSize: `${layer.fontSize}px`,
        fontWeight: layer.fontWeight,
        color: layer.color,
        opacity: layer.opacity / 100,
        letterSpacing: `${layer.letterSpacing}px`,
        textShadow: layer.dropShadow ? '3px 3px 8px rgba(0,0,0,0.85), 0 0 20px rgba(0,0,0,0.4)' : 'none',
        zIndex: zIndex,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        lineHeight: 1.1,
      }}
    >
      {layer.text}
    </div>
  );
}

// Color picker — swatch triggers the hidden native input via ref
function ColorPicker({ value, onChange }) {
  const inputRef = useRef(null);
  const safeValue = value?.startsWith('#') ? value : '#ffffff';

  return (
    <div className="space-y-2">
      <span className="text-[13px] font-medium text-muted-foreground">Color</span>
      <div className="flex items-center gap-2.5">
        {/* Swatch — clicking it opens the native color picker */}
        <div
          onClick={() => inputRef.current?.click()}
          className="w-10 h-10 rounded-lg border border-border flex-shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: safeValue }}
          title="Click to pick a color"
        >
          {/* Hidden input lives inside the swatch but sr-only so overflow can't block it */}
          <input
            ref={inputRef}
            type="color"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            tabIndex={-1}
          />
        </div>
        {/* Hex text input */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 text-[13px] font-mono bg-card border-border rounded-lg text-muted-foreground flex-1 focus-visible:ring-1 focus-visible:ring-[#7c3aed]/50"
        />
      </div>
    </div>
  );
}

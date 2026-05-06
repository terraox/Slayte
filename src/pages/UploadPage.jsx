import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Paperclip, ArrowLeft } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ModeToggle } from '@/components/mode-toggle';

export default function UploadPage({ onImageUpload, onBack }) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelected(file);
    }
  }, []);

  const handleFileSelected = (file) => {
    if (!file) return;
    
    console.log("UploadPage: File selected", file.name, file.type);
    
    // 1. Create a local preview URL
    const localUrl = URL.createObjectURL(file);
    
    // 2. Pass to parent (App.jsx) immediately to switch to editor
    onImageUpload({ url: localUrl, file });

    // 3. Background server upload (non-blocking)
    const formData = new FormData();
    formData.append('image', file);
    fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    })
    .then(async res => {
      const data = await res.json();
      if (res.ok) console.log("UploadPage: Server upload success", data);
      else console.error("UploadPage: Server upload error", data);
    })
    .catch(err => {
      console.error("UploadPage: Network error during upload", err);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(false);
  };

  const triggerFileInput = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("UploadPage: Triggering file input");
    fileInputRef.current?.click();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* Hidden file input — kept separate from clickable UI */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
        }}
      />

      {/* Theme toggle — top right */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px]"
          style={{ 
            background: 'radial-gradient(ellipse at center, #3b0764 0%, transparent 65%)',
            opacity: 0.3 
          }} 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-[620px] px-4">

        {/* Back button */}
        <BlurFade delay={0.05} inView className="self-start mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Slayte
          </button>
        </BlurFade>

        {/* Header */}
        <BlurFade delay={0.1} inView className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Upload your image
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-sm mx-auto">
            Choose a base image to start designing your thumbnail with text overlays and effects.
          </p>
        </BlurFade>

        {/* Dropzone */}
        <BlurFade delay={0.25} inView className="w-full">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={triggerFileInput}
            className={`
              group relative flex flex-col items-center justify-center w-full py-14 px-8
              rounded-[28px] border transition-all duration-500 ease-out cursor-pointer overflow-hidden
              backdrop-blur-xl
              ${isHovering
                ? 'border-border bg-muted scale-[1.015] shadow-[0_0_60px_rgba(124,58,237,0.12)]'
                : 'border-border bg-white/[0.025] hover:border-border hover:bg-card'}
            `}
          >
            {/* Inner ambient glow */}
            <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden">
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] opacity-60"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(93,202,165,0.5), transparent)' }}
              />
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-16 opacity-[0.07]"
                style={{ background: 'radial-gradient(ellipse at top, #7c3aed, transparent)' }}
              />
            </div>

            <BorderBeam size={80} duration={8} colorFrom="#7c3aed" colorTo="#5DCAA5" />

            {/* Animated Upload Icon */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-5"
            >
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 to-teal-500/15 border border-border">
                <UploadCloud size={28} strokeWidth={1.5} className="text-muted-foreground" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-teal-500/10 blur-xl -z-10" />
              </div>
            </motion.div>

            <h3 className="text-lg font-semibold mb-1.5 text-foreground">
              Drop your image to begin
            </h3>
            <p className="text-[13px] mb-5 text-muted-foreground">
              Drag and drop or click to browse
            </p>

            {/* Format Badges */}
            <div className="flex items-center gap-1.5 mb-7">
              {['JPG', 'PNG', 'WEBP', 'SVG'].map((format) => (
                <span
                  key={format}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-border bg-card text-muted-foreground tracking-wide"
                >
                  {format}
                </span>
              ))}
            </div>

            <ShimmerButton
              shimmerColor="#7c3aed"
              shimmerDuration="2s"
              background="rgba(124, 58, 237, 0.08)"
              className="h-10 px-6 shadow-none border border-border group-hover:border-border transition-colors"
              onClick={triggerFileInput}
            >
              <Paperclip className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
              <span className="text-[13px] font-medium text-muted-foreground">Select File</span>
            </ShimmerButton>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}

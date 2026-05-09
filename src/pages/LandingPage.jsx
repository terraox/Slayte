import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Image, Mail } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Meteors } from '@/components/magicui/meteors';
import { SlayteLogo } from '@/components/SlayteLogo';
import { ModeToggle } from '@/components/mode-toggle';

export default function LandingPage({ onSelectTool }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden scroll-smooth bg-background">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-4 h-4 rounded-full bg-foreground/20 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px]"
          style={{ 
            background: 'radial-gradient(ellipse at center, hsl(var(--primary)/0.25) 0%, transparent 65%)',
            opacity: 1 
          }} 
        />
        <Meteors number={15} />
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="relative z-20 w-full px-6 md:px-10 py-5 flex items-center justify-between border-b border-border">
        <SlayteLogo size={34} />
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-20 px-4 md:px-6 flex-1">

        {/* ─── HERO SECTION ─── */}
        <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">

          {/* Tagline pill */}
          <BlurFade delay={0.1} inView>
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]" />
              <span className="text-[13px] font-medium text-muted-foreground tracking-wide">
                Professional visuals, zero friction.
              </span>
            </div>
          </BlurFade>

          {/* Headline */}
          <BlurFade delay={0.2} inView>
            <h1 className="font-heading font-extrabold tracking-tighter leading-[1.05] text-foreground" style={{ fontSize: 'clamp(52px, 7vw, 80px)' }}>
              Design without
            </h1>
          </BlurFade>
          <BlurFade delay={0.35} inView>
            <SparklesText
              className="font-heading font-extrabold tracking-tighter leading-[1.05]"
              colors={{ first: '#5DCAA5', second: '#7c3aed' }}
              sparklesCount={8}
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  fontSize: 'clamp(52px, 7vw, 80px)',
                  backgroundImage: 'linear-gradient(135deg, #5DCAA5, #7c3aed)',
                }}
              >
                the code.
              </span>
            </SparklesText>
          </BlurFade>

          {/* Subheadline */}
          <BlurFade delay={0.5} inView>
            <p className="mt-6 text-[17px] leading-[1.7] max-w-[480px] mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Thumbnails. Email templates. Visual content. Build it all visually — no HTML, no inline CSS, no copying weird outputs.
            </p>
          </BlurFade>


        </div>

        {/* ─── TOOL CARDS ─── */}
        <BlurFade delay={0.75} inView className="w-full max-w-[1200px] mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Content Cover Studio Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onSelectTool('thumbnail')}
              className="group relative flex flex-col items-start p-8 rounded-[24px] border border-border bg-card/60 backdrop-blur-xl cursor-pointer overflow-hidden transition-colors duration-500 hover:border-foreground/20 hover:bg-muted/60 min-h-[280px]"
            >
              {/* Top ambient glow */}
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden">
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(93,202,165,0.5), transparent)' }}
                />
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-20 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.1]"
                  style={{ background: 'radial-gradient(ellipse at top, #7c3aed, transparent)' }}
                />
              </div>

              <BorderBeam size={60} duration={10} colorFrom="#7c3aed" colorTo="#5DCAA5" />

              {/* Icon */}
              <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-purple-500/15 to-teal-500/15 border border-border mb-5">
                <Image size={22} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-teal-500/10 blur-xl -z-10" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1.5">
                Content Cover Studio
              </h3>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Overlay text, effects, and filters. Perfect for YouTube thumbnails and social posts.
              </p>

              {/* Bottom action */}
              <div className="mt-auto flex items-center gap-2 text-[13px] font-medium text-[#7c3aed] group-hover:text-[#9f67ff] transition-colors">
                Start creating
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Format tags */}
              <div className="absolute bottom-6 right-6 flex gap-1">
                {['JPG', 'PNG'].map((f) => (
                  <span key={f} className="px-1.5 py-0.5 rounded text-[9px] font-medium border border-border bg-muted/50 text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Email Writer Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onSelectTool('email')}
              className="group relative flex flex-col items-start p-8 rounded-[24px] border border-border bg-card/60 backdrop-blur-xl cursor-pointer overflow-hidden transition-colors duration-500 hover:border-foreground/20 hover:bg-muted/60 min-h-[280px]"
            >
              {/* Top ambient glow */}
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden">
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(93,202,165,0.5), rgba(124,58,237,0.4), transparent)' }}
                />
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-20 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.1]"
                  style={{ background: 'radial-gradient(ellipse at top, #5DCAA5, transparent)' }}
                />
              </div>

              <BorderBeam size={60} duration={10} colorFrom="#5DCAA5" colorTo="#7c3aed" />

              {/* Icon */}
              <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-teal-500/15 to-purple-500/15 border border-border mb-5">
                <Mail size={22} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/10 to-purple-500/10 blur-xl -z-10" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1.5">
                Email Writer
              </h3>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Design rich HTML email templates visually. Drag, drop, and export clean code.
              </p>

              {/* Bottom action */}
              <div className="mt-auto flex items-center gap-2 text-[13px] font-medium text-[#5DCAA5] group-hover:text-[#7ee8c7] transition-colors">
                Start writing
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Tags */}
              <div className="absolute bottom-6 right-6 flex gap-1">
                {['HTML', 'CSS'].map((f) => (
                  <span key={f} className="px-1.5 py-0.5 rounded text-[9px] font-medium border border-border bg-muted/50 text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Export Sizes Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onSelectTool('export-sizes')}
              className="group relative flex flex-col items-start p-8 rounded-[24px] border border-border bg-card/60 backdrop-blur-xl cursor-pointer overflow-hidden transition-colors duration-500 hover:border-foreground/20 hover:bg-muted/60 min-h-[280px]"
            >
              {/* Top ambient glow */}
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden">
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] opacity-50"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(93,202,165,0.5), transparent)' }}
                />
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[50%] h-20 opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.1]"
                  style={{ background: 'radial-gradient(ellipse at top, #7c3aed, transparent)' }}
                />
              </div>

              <BorderBeam size={60} duration={10} colorFrom="#7c3aed" colorTo="#5DCAA5" />

              {/* Icon */}
              <div className="relative p-3.5 rounded-xl bg-gradient-to-br from-purple-500/15 to-teal-500/15 border border-border mb-5">
                <div className="flex gap-0.5">
                  <div className="w-2.5 h-2.5 border border-muted-foreground rounded-sm" />
                  <div className="w-3.5 h-3.5 border border-muted-foreground rounded-sm" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/10 to-teal-500/10 blur-xl -z-10" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1.5">
                Export Sizes
              </h3>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Resize multiple images to all standard social media dimensions in one click.
              </p>

              {/* Bottom action */}
              <div className="mt-auto flex items-center gap-2 text-[13px] font-medium text-[#7c3aed] group-hover:text-[#9f67ff] transition-colors">
                Start resizing
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Tags */}
              <div className="absolute bottom-6 right-6 flex gap-1">
                {['BATCH', 'RESIZE'].map((f) => (
                  <span key={f} className="px-1.5 py-0.5 rounded text-[9px] font-medium border border-border bg-muted/50 text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </BlurFade>

      </div>
    </div>
  );
}

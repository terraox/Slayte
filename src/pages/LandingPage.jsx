import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Image, Mail } from 'lucide-react';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Meteors } from '@/components/magicui/meteors';
import { SlayteLogo } from '@/components/SlayteLogo';

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
    <div className="relative min-h-screen w-full overflow-hidden scroll-smooth" style={{ background: '#080808' }}>
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-4 h-4 rounded-full bg-white/20 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
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
            background: 'radial-gradient(ellipse at center, #3b0764 0%, transparent 65%)',
            opacity: 0.4 
          }} 
        />
        <Meteors number={15} />
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className="relative z-20 w-full px-6 md:px-10 py-5 flex items-center border-b border-white/[0.06]">
        <SlayteLogo size={34} />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-20 px-4 md:px-6 flex-1">

        {/* ─── HERO SECTION ─── */}
        <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">
          
          {/* Pill Badge */}
          <BlurFade delay={0.1} inView>
            <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 mb-8 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
              <span
                className="animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
                style={{
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "subtract",
                }}
              />
              <Sparkles className="w-3.5 h-3.5 text-[#ffaa40] mr-2" />
              <AnimatedGradientText className="text-sm font-medium" colorFrom="#ffaa40" colorTo="#9c40ff">
                Now in Beta — Free to use
              </AnimatedGradientText>
            </div>
          </BlurFade>

          {/* Headline */}
          <BlurFade delay={0.2} inView>
            <h1 className="font-heading font-extrabold tracking-tighter leading-[1.05]" style={{ fontSize: 'clamp(52px, 7vw, 80px)', color: '#f1f0ec' }}>
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
            <p className="mt-6 text-[17px] leading-[1.7] max-w-[480px] mx-auto" style={{ color: '#888888' }}>
              Thumbnails. Email templates. Visual content. Build it all visually — no HTML, no inline CSS, no copying weird outputs.
            </p>
          </BlurFade>

          {/* Social Proof */}
          <BlurFade delay={0.6} inView>
            <p className="mt-5 text-xs tracking-wide" style={{ color: '#555' }}>
              ✦ 200+ creators already using Slayte
            </p>
          </BlurFade>
        </div>

        {/* ─── TOOL CARDS ─── */}
        <BlurFade delay={0.75} inView className="w-full max-w-[960px] mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Thumbnail Creator Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onClick={() => onSelectTool('thumbnail')}
              className="group relative flex flex-col items-start p-9 rounded-[24px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl cursor-pointer overflow-hidden transition-colors duration-500 hover:border-white/[0.14] hover:bg-white/[0.04] min-h-[280px]"
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
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 to-teal-500/15 border border-white/[0.06] mb-6">
                <Image size={26} strokeWidth={1.5} className="text-[#bbb] group-hover:text-[#f1f0ec] transition-colors" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-teal-500/10 blur-xl -z-10" />
              </div>

              <h3 className="text-xl font-semibold text-[#f1f0ec] mb-2">
                Thumbnail Creator
              </h3>
              <p className="text-[14px] leading-relaxed text-[#666] mb-8">
                Upload an image and overlay text, effects, and filters. Perfect for YouTube thumbnails, social posts, and cover art.
              </p>

              {/* Bottom action */}
              <div className="mt-auto flex items-center gap-2 text-[14px] font-medium text-[#7c3aed] group-hover:text-[#9f67ff] transition-colors">
                Start creating
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Format tags */}
              <div className="absolute bottom-7 right-7 flex gap-1">
                {['JPG', 'PNG', 'SVG'].map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded text-[10px] font-medium border border-white/[0.06] bg-white/[0.02] text-[#555]">
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
              className="group relative flex flex-col items-start p-9 rounded-[24px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl cursor-pointer overflow-hidden transition-colors duration-500 hover:border-white/[0.14] hover:bg-white/[0.04] min-h-[280px]"
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
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-teal-500/15 to-purple-500/15 border border-white/[0.06] mb-6">
                <Mail size={26} strokeWidth={1.5} className="text-[#bbb] group-hover:text-[#f1f0ec] transition-colors" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-purple-500/10 blur-xl -z-10" />
              </div>

              <h3 className="text-xl font-semibold text-[#f1f0ec] mb-2">
                Email Writer
              </h3>
              <p className="text-[14px] leading-relaxed text-[#666] mb-8">
                Design rich HTML email templates visually. Drag, drop, and style — export clean code that works everywhere.
              </p>

              {/* Bottom action */}
              <div className="mt-auto flex items-center gap-2 text-[14px] font-medium text-[#5DCAA5] group-hover:text-[#7ee8c7] transition-colors">
                Start writing
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>

              {/* Tags */}
              <div className="absolute bottom-7 right-7 flex gap-1">
                {['HTML', 'CSS'].map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded text-[10px] font-medium border border-white/[0.06] bg-white/[0.02] text-[#555]">
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

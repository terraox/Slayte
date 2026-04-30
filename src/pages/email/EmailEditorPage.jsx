import { useState, useRef, useCallback } from 'react';
import {
  ArrowLeft, Monitor, Smartphone, Eye, Send, Paintbrush,
  MessageSquare, Languages, Download, Trash2, GripVertical, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlayteLogo } from '@/components/SlayteLogo';
import { BLOCK_TYPES, createBlock } from './blockDefs';
import { BlockRenderer, generateEmailHTML } from './BlockRenderer';
import { PropertyEditor } from './PropertyEditor';

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onAnimationComplete={() => setTimeout(onDone, 1800)}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-full border border-[#5DCAA5]/30 bg-[#0f0f0f] text-[#5DCAA5] shadow-xl text-[13px] font-medium"
    >
      <Check className="w-4 h-4" />
      {message}
    </motion.div>
  );
}

// Icon badge colors per block category
const TILE_COLORS = {
  title: '#7c3aed', paragraph: '#7c3aed', list: '#7c3aed',
  image: '#5DCAA5', button: '#5DCAA5', video: '#5DCAA5', gif: '#5DCAA5',
  table: '#f59e0b', divider: '#f59e0b', spacer: '#f59e0b',
  social: '#ec4899', menu: '#ec4899', icons: '#ec4899', sticker: '#ec4899',
  html: '#3b82f6',
};

// ─── Sidebar block tile (square card) ────────────────────────────────────────
function BlockTile({ blockDef }) {
  const accent = TILE_COLORS[blockDef.type] || '#7c3aed';
  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('blockType', blockDef.type);
        e.dataTransfer.effectAllowed = 'copy';
      }}
      className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-grab active:cursor-grabbing select-none transition-all duration-150 hover:bg-white/[0.05] hover:border-white/[0.12] hover:shadow-sm"
    >
      {/* Icon badge */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-150 group-hover:scale-110"
        style={{ background: `${accent}20`, border: `1px solid ${accent}35` }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{blockDef.icon}</span>
      </div>
      {/* Label */}
      <span className="text-[11px] font-medium text-[#666] group-hover:text-[#aaa] transition-colors tracking-wide text-center leading-tight">
        {blockDef.label}
      </span>
    </div>
  );
}

// ─── Canvas block row ─────────────────────────────────────────────────────────
function CanvasBlock({ block, isSelected, onSelect, onDelete, onDragStart, onDragOver, onDrop }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={e => { e.preventDefault(); onDragOver(); }}
      onDrop={onDrop}
      onClick={onSelect}
      className={`group relative rounded-lg border transition-all cursor-pointer mb-2 ${
        isSelected
          ? 'border-[#7c3aed]/60 bg-[#7c3aed]/[0.04] shadow-[0_0_0_1px_rgba(124,58,237,0.2)]'
          : 'border-transparent hover:border-white/[0.1] hover:bg-white/[0.02]'
      }`}
    >
      {/* Drag handle */}
      <div className="absolute left-0 top-0 bottom-0 w-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="w-3.5 h-3.5 text-[#444]" />
      </div>

      {/* Delete button */}
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 z-10"
      >
        <Trash2 className="w-3 h-3 text-[#555] hover:text-red-400" />
      </button>

      {/* Block content */}
      <div className="px-8 py-3">
        <BlockRenderer block={block} />
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#7c3aed] rounded-l-lg" />
      )}
    </div>
  );
}

// ─── Main EmailEditorPage ─────────────────────────────────────────────────────
export default function EmailEditorPage({ onLeave, onExport }) {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [emailTitle, setEmailTitle] = useState('Untitled Email');
  const [editingTitle, setEditingTitle] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [dropHighlight, setDropHighlight] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dragBlockId = useRef(null);

  const selectedBlock = blocks.find(b => b.id === selectedId) || null;

  // ── Block mutations ──
  const addBlock = useCallback((type, afterId = null) => {
    const block = createBlock(type);
    setBlocks(prev => {
      if (afterId) {
        const idx = prev.findIndex(b => b.id === afterId);
        const next = [...prev];
        next.splice(idx + 1, 0, block);
        return next;
      }
      return [...prev, block];
    });
    setSelectedId(block.id);
  }, []);

  const updateBlock = useCallback((id, newProps) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, props: newProps } : b));
  }, []);

  const deleteBlock = useCallback((id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setSelectedId(s => s === id ? null : s);
  }, []);

  // ── Drop zone (from sidebar) ──
  const handleCanvasDrop = (e) => {
    e.preventDefault();
    setDropHighlight(false);
    const type = e.dataTransfer.getData('blockType');
    if (type) addBlock(type);
  };

  // ── Reorder via drag within canvas ──
  const handleBlockDragStart = (id) => { dragBlockId.current = id; };
  const handleBlockDragOver = (id) => { if (id !== dragBlockId.current) setDragOverId(id); };
  const handleBlockDrop = (targetId) => {
    if (!dragBlockId.current || dragBlockId.current === targetId) return;
    setBlocks(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(b => b.id === dragBlockId.current);
      const toIdx = arr.findIndex(b => b.id === targetId);
      const [moved] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, moved);
      return arr;
    });
    dragBlockId.current = null;
    setDragOverId(null);
  };

  // ── Export ──
  const handleExport = () => {
    const html = generateEmailHTML(blocks, emailTitle);
    onExport?.(html);
    setToast('Email exported successfully!');
  };

  const canvasMaxWidth = previewMode === 'mobile' ? 440 : 820;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#080808' }}>

      {/* ─── TOOLBAR ─── */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/[0.06] flex-shrink-0 gap-4">

        {/* Left: back + logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button onClick={onLeave}
            className="flex items-center gap-1.5 text-[13px] text-[#666] hover:text-[#f1f0ec] transition-colors font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div className="w-px h-5 bg-white/[0.08]" />
          <SlayteLogo size={22} />
        </div>

        {/* Center: editable title + mode chip + actions */}
        <div className="flex items-center gap-3 flex-1 justify-center min-w-0">
          {editingTitle ? (
            <input
              autoFocus
              value={emailTitle}
              onChange={e => setEmailTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingTitle(false)}
              className="text-[13px] font-medium text-[#f1f0ec] bg-white/[0.06] border border-white/[0.12] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#7c3aed]/50 max-w-[220px]"
            />
          ) : (
            <button onClick={() => setEditingTitle(true)}
              className="text-[13px] font-medium text-[#f1f0ec] hover:text-white truncate max-w-[180px]">
              {emailTitle}
            </button>
          )}

          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[#555] tracking-wider">
            Email
          </span>

          <div className="flex items-center gap-0.5">
            {[
              { Icon: Eye, title: 'Preview' },
              { Icon: Send, title: 'Send Test' },
              { Icon: Paintbrush, title: 'Design' },
              { Icon: MessageSquare, title: 'Comments' },
              { Icon: Languages, title: 'Translate' },
            ].map(({ Icon, title }) => (
              <button key={title} title={title}
                className="p-2 rounded-lg text-[#888] hover:text-[#f1f0ec] hover:bg-white/[0.05] transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: export */}
        <button onClick={handleExport}
          className="flex items-center gap-1.5 h-8 px-5 rounded-lg text-[12px] font-semibold text-white flex-shrink-0 transition-all shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.03] active:scale-100"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #5DCAA5)' }}>
          <Download className="w-3 h-3" />
          Export
        </button>
      </header>

      {/* ─── WORKSPACE ─── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Canvas area ── */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#0c0c0c' }}>

          {/* Preview toggle */}
          <div className="flex items-center gap-1.5 px-6 pt-4 pb-2">
            <button onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-lg transition-colors ${previewMode === 'desktop' ? 'text-[#f1f0ec] bg-white/[0.08]' : 'text-[#555] hover:text-[#888]'}`}>
              <Monitor className="w-4 h-4" />
            </button>
            <button onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded-lg transition-colors ${previewMode === 'mobile' ? 'text-[#f1f0ec] bg-white/[0.08]' : 'text-[#555] hover:text-[#888]'}`}>
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable canvas */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div
              className="mx-auto px-6 py-6"
              style={{ maxWidth: canvasMaxWidth, transition: 'max-width 0.3s ease' }}
            >
              {/* Email shell */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', minHeight: 'calc(100vh - 220px)' }}
                onDragOver={e => { e.preventDefault(); setDropHighlight(true); }}
                onDragLeave={() => setDropHighlight(false)}
                onDrop={handleCanvasDrop}
              >
                <div className="px-10 py-10">
                  {blocks.length === 0 ? (
                    /* Empty state drop zone */
                    <div
                      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
                        dropHighlight
                          ? 'border-[#7c3aed]/60 bg-[#7c3aed]/[0.06]'
                          : 'border-white/[0.08]'
                      }`}
                      style={{ minHeight: 'calc(100vh - 340px)' }}
                    >
                      <div className={`flex flex-col items-center gap-4 transition-transform duration-300 ${dropHighlight ? 'scale-105' : ''}`}>
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                          <span className="text-2xl">✦</span>
                        </div>
                        <p className="text-[15px] text-[#444] font-medium">Drop content blocks here</p>
                        <p className="text-[13px] text-[#2e2e2e]">Drag from the Content panel →</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg transition-colors duration-200 ${
                        dropHighlight ? 'outline-dashed outline-2 outline-[#7c3aed]/40' : ''
                      }`}
                    >
                      {blocks.map(block => (
                        <div
                          key={block.id}
                          className={`transition-all duration-150 ${dragOverId === block.id ? 'border-t-2 border-[#7c3aed]' : ''}`}
                        >
                          <CanvasBlock
                            block={block}
                            isSelected={selectedId === block.id}
                            onSelect={() => setSelectedId(id => id === block.id ? null : block.id)}
                            onDelete={() => deleteBlock(block.id)}
                            onDragStart={() => handleBlockDragStart(block.id)}
                            onDragOver={() => handleBlockDragOver(block.id)}
                            onDrop={() => handleBlockDrop(block.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-10 py-6 border-t border-white/[0.04] text-center">
                  <p className="text-[12px] text-[#2e2e2e]">Designed with Slayte</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="relative flex flex-shrink-0">

          {/* Collapse toggle tab */}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-10 rounded-full border border-white/[0.1] bg-[#161616] flex items-center justify-center text-[#555] hover:text-[#aaa] hover:border-white/[0.2] transition-all shadow-md"
            title={sidebarOpen ? 'Collapse panel' : 'Expand panel'}
          >
            <motion.span
              animate={{ rotate: sidebarOpen ? 0 : 180 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] leading-none select-none"
            >
              ›
            </motion.span>
          </button>

          <motion.div
            animate={{ width: sidebarOpen ? 340 : 0, opacity: sidebarOpen ? 1 : 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col overflow-hidden border-l border-white/[0.06]"
            style={{ background: '#0f0f0f' }}
          >
            <div className="w-[340px] flex flex-col h-full">
              <AnimatePresence mode="wait">
                {selectedBlock ? (
                  /* Property editor */
                  <motion.div key="props" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.15 }} className="flex flex-col h-full">
                    <PropertyEditor
                      block={selectedBlock}
                      onChange={newProps => updateBlock(selectedId, newProps)}
                      onClose={() => setSelectedId(null)}
                    />
                  </motion.div>
                ) : (
                  /* Block list */
                  <motion.div key="blocks" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.15 }} className="flex flex-col h-full">

                    {/* Sidebar header */}
                    <div className="px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-1">Elements</p>
                      <h2 className="text-[15px] font-semibold text-[#f1f0ec] tracking-tight">Content Blocks</h2>
                      <p className="text-[12px] text-[#444] mt-1">Drag any block onto the canvas</p>
                    </div>

                    {/* Block grid */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
                      <div className="grid grid-cols-3 gap-2">
                        {BLOCK_TYPES.map(def => (
                          <BlockTile key={def.type} blockDef={def} />
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}} />

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

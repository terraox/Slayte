import { X } from 'lucide-react';

// Simple reusable field components
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#555]">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, multiline }) {
  const cls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-[13px] text-[#ccc] px-3 py-2 focus:outline-none focus:border-[#7c3aed]/50 transition-colors resize-none";
  return multiline
    ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />;
}

function NumberInput({ value, onChange, min, max }) {
  return (
    <input
      type="number" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-[13px] text-[#ccc] px-3 py-2 focus:outline-none focus:border-[#7c3aed]/50 transition-colors"
    />
  );
}

function ColorInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-9 h-9 rounded-lg border border-white/[0.1] overflow-hidden flex-shrink-0 cursor-pointer">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-[200%] h-[200%] -top-1/2 -left-1/2 cursor-pointer opacity-0" />
        <div className="absolute inset-0" style={{ backgroundColor: value }} />
      </div>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[13px] text-[#aaa] font-mono px-3 py-2 focus:outline-none focus:border-[#7c3aed]/50 transition-colors" />
    </div>
  );
}

const ALIGN_ICONS = { left: '⇤', center: '↔', right: '⇥' };
const ALIGN_LABELS = { left: 'Left', center: 'Center', right: 'Right' };

function AlignSelect({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {['left', 'center', 'right'].map(a => (
        <button
          key={a}
          onClick={() => onChange(a)}
          title={ALIGN_LABELS[a]}
          className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all duration-150 ${
            value === a
              ? 'border-[#7c3aed]/50 bg-[#7c3aed]/[0.15] text-[#b48aff] shadow-[0_0_12px_rgba(124,58,237,0.15)]'
              : 'border-white/[0.07] bg-white/[0.02] text-[#444] hover:text-[#888] hover:border-white/[0.12] hover:bg-white/[0.04]'
          }`}
        >
          <span className="text-base leading-none">{ALIGN_ICONS[a]}</span>
          <span className="text-[10px] font-medium tracking-wide">{ALIGN_LABELS[a]}</span>
        </button>
      ))}
    </div>
  );
}

export function PropertyEditor({ block, onChange, onClose }) {
  const { type, props: p } = block;
  const set = (key, val) => onChange({ ...p, [key]: val });

  const renderFields = () => {
    switch (type) {
      case 'title':
        return <>
          <Field label="Heading Text"><TextInput value={p.text} onChange={v => set('text', v)} /></Field>
          <Field label="Font Size (px)"><NumberInput value={p.fontSize} onChange={v => set('fontSize', v)} min={12} max={96} /></Field>
          <Field label="Text Color"><ColorInput value={p.color} onChange={v => set('color', v)} /></Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
          <Field label="Font Weight">
            <select value={p.fontWeight} onChange={e => set('fontWeight', e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-[13px] text-[#ccc] px-3 py-2 focus:outline-none">
              <option value="normal">Normal (400)</option>
              <option value="bold">Bold (700)</option>
              <option value="800">Extra Bold (800)</option>
            </select>
          </Field>
        </>;

      case 'paragraph':
        return <>
          <Field label="Body Text"><TextInput value={p.text} onChange={v => set('text', v)} multiline /></Field>
          <Field label="Font Size (px)"><NumberInput value={p.fontSize} onChange={v => set('fontSize', v)} min={10} max={48} /></Field>
          <Field label="Text Color"><ColorInput value={p.color} onChange={v => set('color', v)} /></Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
          <Field label="Line Height"><NumberInput value={p.lineHeight} onChange={v => set('lineHeight', v)} min={1} max={3} /></Field>
        </>;

      case 'list':
        return <>
          <Field label="List Items — one per line">
            <TextInput value={p.items.join('\n')} onChange={v => set('items', v.split('\n'))} multiline />
          </Field>
          <Field label="List Style">
            <select value={p.style} onChange={e => set('style', e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg text-[13px] text-[#ccc] px-3 py-2 focus:outline-none">
              <option value="bullet">Bullet (•)</option>
              <option value="numbered">Numbered (1. 2. 3.)</option>
            </select>
          </Field>
          <Field label="Font Size (px)"><NumberInput value={p.fontSize} onChange={v => set('fontSize', v)} min={10} max={48} /></Field>
          <Field label="Text Color"><ColorInput value={p.color} onChange={v => set('color', v)} /></Field>
        </>;

      case 'image':
        return <>
          <Field label="Image URL"><TextInput value={p.src} onChange={v => set('src', v)} placeholder="https://example.com/image.jpg" /></Field>
          <Field label="Alt Description"><TextInput value={p.alt} onChange={v => set('alt', v)} placeholder="Describe the image" /></Field>
          <Field label="Corner Radius (px)"><NumberInput value={p.borderRadius} onChange={v => set('borderRadius', v)} min={0} max={50} /></Field>
        </>;

      case 'button':
        return <>
          <Field label="Button Label"><TextInput value={p.text} onChange={v => set('text', v)} /></Field>
          <Field label="Destination URL"><TextInput value={p.href} onChange={v => set('href', v)} placeholder="https://..." /></Field>
          <Field label="Background Color"><ColorInput value={p.bgColor} onChange={v => set('bgColor', v)} /></Field>
          <Field label="Label Color"><ColorInput value={p.textColor} onChange={v => set('textColor', v)} /></Field>
          <Field label="Corner Radius (px)"><NumberInput value={p.borderRadius} onChange={v => set('borderRadius', v)} min={0} max={50} /></Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
        </>;

      case 'divider':
        return <>
          <Field label="Line Color"><ColorInput value={p.color} onChange={v => set('color', v)} /></Field>
          <Field label="Thickness (px)"><NumberInput value={p.thickness} onChange={v => set('thickness', v)} min={1} max={8} /></Field>
          <Field label="Vertical Spacing (px)"><NumberInput value={p.margin} onChange={v => set('margin', v)} min={0} max={80} /></Field>
        </>;

      case 'spacer':
        return <Field label="Height (px)"><NumberInput value={p.height} onChange={v => set('height', v)} min={8} max={200} /></Field>;

      case 'social':
        return <>
          <Field label="Social Links">
            <p className="text-[11px] text-[#444] mb-1.5 leading-snug">One per line — format: <span className="font-mono text-[#5DCAA5]">Platform|URL</span></p>
            <TextInput value={p.links.map(l => `${l.platform}|${l.url}`).join('\n')}
              onChange={v => set('links', v.split('\n').filter(Boolean).map(line => {
                const [platform, url = '#'] = line.split('|');
                return { platform: platform.trim(), url: url.trim() };
              }))} multiline />
          </Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
        </>;

      case 'html':
        return <Field label="Raw HTML">
          <p className="text-[11px] text-[#444] mb-1.5">Paste any valid HTML. Inline styles recommended for email.</p>
          <TextInput value={p.code} onChange={v => set('code', v)} multiline />
        </Field>;

      case 'video':
        return <>
          <Field label="Video URL"><TextInput value={p.url} onChange={v => set('url', v)} placeholder="https://youtube.com/watch?v=..." /></Field>
          <Field label="Thumbnail Caption"><TextInput value={p.caption} onChange={v => set('caption', v)} /></Field>
        </>;

      case 'icons':
        return <>
          <Field label="Icons">
            <p className="text-[11px] text-[#444] mb-1.5">Comma-separated emoji, e.g. <span className="font-mono text-[#5DCAA5]">⭐, 🔥, ✅</span></p>
            <TextInput value={p.icons.join(', ')} onChange={v => set('icons', v.split(',').map(s => s.trim()).filter(Boolean))} />
          </Field>
          <Field label="Icon Size (px)"><NumberInput value={p.size} onChange={v => set('size', v)} min={16} max={96} /></Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
        </>;

      case 'menu':
        return <>
          <Field label="Navigation Links">
            <p className="text-[11px] text-[#444] mb-1.5 leading-snug">One per line — format: <span className="font-mono text-[#5DCAA5]">Label|URL</span></p>
            <TextInput value={p.links.map(l => `${l.label}|${l.url}`).join('\n')}
              onChange={v => set('links', v.split('\n').filter(Boolean).map(line => {
                const [label, url = '#'] = line.split('|');
                return { label: label.trim(), url: url.trim() };
              }))} multiline />
          </Field>
          <Field label="Link Color"><ColorInput value={p.color} onChange={v => set('color', v)} /></Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
        </>;

      case 'sticker':
        return <>
          <Field label="Emoji"><TextInput value={p.emoji} onChange={v => set('emoji', v)} placeholder="🎉" /></Field>
          <Field label="Display Size (px)"><NumberInput value={p.size} onChange={v => set('size', v)} min={24} max={128} /></Field>
          <Field label="Alignment"><AlignSelect value={p.align} onChange={v => set('align', v)} /></Field>
        </>;

      case 'gif':
        return <>
          <Field label="GIF URL"><TextInput value={p.src} onChange={v => set('src', v)} placeholder="https://media.giphy.com/..." /></Field>
          <Field label="Alt Description"><TextInput value={p.alt} onChange={v => set('alt', v)} placeholder="Describe the GIF" /></Field>
        </>;

      case 'table':
        return <>
          <Field label="Column Headers">
            <p className="text-[11px] text-[#444] mb-1.5">Comma-separated, e.g. <span className="font-mono text-[#5DCAA5]">Name, Email, Role</span></p>
            <TextInput value={p.headers.join(', ')} onChange={v => set('headers', v.split(',').map(s => s.trim()))} />
          </Field>
          <Field label="Border Color"><ColorInput value={p.borderColor} onChange={v => set('borderColor', v)} /></Field>
        </>;

      default:
        return <p className="text-[#555] text-[13px]">No editable properties.</p>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#444] mb-1">Properties</p>
          <h3 className="text-[15px] font-semibold text-[#f1f0ec] capitalize tracking-tight">{type}</h3>
        </div>
        <button onClick={onClose}
          title="Back to blocks"
          className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[#555] hover:text-[#aaa] transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 space-y-5">
        {renderFields()}
      </div>
    </div>
  );
}

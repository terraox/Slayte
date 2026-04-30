// Block type catalog shown in the sidebar
export const BLOCK_TYPES = [
  { type: 'title',     label: 'Heading',   icon: 'H₁' },
  { type: 'paragraph', label: 'Text',      icon: '¶'  },
  { type: 'list',      label: 'List',      icon: '≡'  },
  { type: 'image',     label: 'Image',     icon: '🖼'  },
  { type: 'button',    label: 'Button',    icon: '⏎'  },
  { type: 'table',     label: 'Table',     icon: '▦'  },
  { type: 'divider',   label: 'Divider',   icon: '─'  },
  { type: 'spacer',    label: 'Spacer',    icon: '↕'  },
  { type: 'social',    label: 'Social',    icon: '◈'  },
  { type: 'html',      label: 'HTML',      icon: '<>' },
  { type: 'video',     label: 'Video',     icon: '▶'  },
  { type: 'icons',     label: 'Icons',     icon: '✦'  },
  { type: 'menu',      label: 'Nav Menu',  icon: '☰'  },
  { type: 'sticker',   label: 'Sticker',   icon: '🎨'  },
  { type: 'gif',       label: 'GIF',       icon: 'GIF'},
];

// Default props when a block is first dropped
export const DEFAULT_PROPS = {
  title:     { text: 'Your Headline Here', fontSize: 32, color: '#111111', align: 'center', fontWeight: 'bold' },
  paragraph: { text: 'Write your paragraph text here. Keep it concise and engaging for your readers.', fontSize: 15, color: '#444444', align: 'left', lineHeight: 1.7 },
  list:      { items: ['First item', 'Second item', 'Third item'], style: 'bullet', fontSize: 15, color: '#444444' },
  image:     { src: '', alt: 'Image', width: '100%', borderRadius: 8 },
  button:    { text: 'Click Here', href: '#', bgColor: '#7c3aed', textColor: '#ffffff', borderRadius: 6, fontSize: 15, align: 'center' },
  table:     { rows: 3, cols: 3, headers: ['Column 1', 'Column 2', 'Column 3'], data: [['Cell','Cell','Cell'],['Cell','Cell','Cell']], borderColor: '#e5e7eb' },
  divider:   { color: '#e5e7eb', thickness: 1, margin: 16 },
  spacer:    { height: 32 },
  social:    { links: [{ platform: 'Twitter', url: '#' }, { platform: 'LinkedIn', url: '#' }, { platform: 'Instagram', url: '#' }], align: 'center' },
  html:      { code: '<p style="color:#333">Custom HTML block</p>' },
  video:     { url: '', thumbnail: '', caption: 'Watch the video' },
  icons:     { icons: ['⭐', '🔥', '✅'], size: 32, align: 'center' },
  menu:      { links: [{ label: 'Home', url: '#' }, { label: 'About', url: '#' }, { label: 'Contact', url: '#' }], align: 'center', color: '#7c3aed' },
  sticker:   { emoji: '🎉', size: 64, align: 'center' },
  gif:       { src: '', alt: 'GIF', width: '100%' },
};

export function createBlock(type) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    props: { ...DEFAULT_PROPS[type] },
  };
}

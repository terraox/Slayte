// Renders a block on the canvas
export function BlockRenderer({ block }) {
  const { type, props: p } = block;

  switch (type) {
    case 'title':
      return (
        <div style={{ textAlign: p.align, padding: '8px 0' }}>
          <span style={{ fontSize: p.fontSize, fontWeight: p.fontWeight, color: p.color, lineHeight: 1.2 }}>
            {p.text}
          </span>
        </div>
      );

    case 'paragraph':
      return (
        <p style={{ fontSize: p.fontSize, color: p.color, textAlign: p.align, lineHeight: p.lineHeight, margin: 0, padding: '4px 0' }}>
          {p.text}
        </p>
      );

    case 'list':
      return (
        <ul style={{ margin: 0, padding: '4px 0 4px 20px', listStyleType: p.style === 'bullet' ? 'disc' : 'decimal' }}>
          {p.items.map((item, i) => (
            <li key={i} style={{ fontSize: p.fontSize, color: p.color, marginBottom: 4 }}>{item}</li>
          ))}
        </ul>
      );

    case 'image':
      return (
        <div style={{ textAlign: 'center', padding: '4px 0' }}>
          {p.src ? (
            <img src={p.src} alt={p.alt} style={{ width: p.width, borderRadius: p.borderRadius, display: 'inline-block' }} />
          ) : (
            <div style={{
              width: '100%', height: 180, background: '#1a1a1a', borderRadius: p.borderRadius,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed #333', color: '#555', fontSize: 13
            }}>
              🖼 Image URL not set
            </div>
          )}
        </div>
      );

    case 'button':
      return (
        <div style={{ textAlign: p.align, padding: '8px 0' }}>
          <a href={p.href} style={{
            display: 'inline-block', backgroundColor: p.bgColor, color: p.textColor,
            padding: '12px 28px', borderRadius: p.borderRadius, fontSize: p.fontSize,
            fontWeight: 600, textDecoration: 'none', letterSpacing: 0.3
          }}>
            {p.text}
          </a>
        </div>
      );

    case 'table':
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {p.headers.map((h, i) => (
                <th key={i} style={{ border: `1px solid ${p.borderColor}`, padding: '8px 12px', background: '#1a1a1a', color: '#ccc', fontWeight: 600, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {p.data.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ border: `1px solid ${p.borderColor}`, padding: '8px 12px', color: '#888' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );

    case 'divider':
      return (
        <div style={{ padding: `${p.margin}px 0` }}>
          <hr style={{ border: 'none', borderTop: `${p.thickness}px solid ${p.color}`, margin: 0 }} />
        </div>
      );

    case 'spacer':
      return <div style={{ height: p.height, width: '100%' }} />;

    case 'social':
      return (
        <div style={{ textAlign: p.align, padding: '8px 0', display: 'flex', gap: 12, justifyContent: p.align === 'center' ? 'center' : p.align === 'right' ? 'flex-end' : 'flex-start', flexWrap: 'wrap' }}>
          {p.links.map((l, i) => (
            <a key={i} href={l.url} style={{
              display: 'inline-block', padding: '6px 14px', background: '#1a1a1a',
              border: '1px solid #333', borderRadius: 20, fontSize: 12, color: '#5DCAA5',
              textDecoration: 'none', fontWeight: 500
            }}>
              {l.platform}
            </a>
          ))}
        </div>
      );

    case 'html':
      return (
        <div style={{ padding: '4px 0' }} dangerouslySetInnerHTML={{ __html: p.code }} />
      );

    case 'video':
      return (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{
            width: '100%', height: 180, background: '#111', borderRadius: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            border: '1px dashed #333', color: '#555', gap: 8
          }}>
            <span style={{ fontSize: 32 }}>▶</span>
            <span style={{ fontSize: 13 }}>{p.caption || 'Video placeholder'}</span>
          </div>
        </div>
      );

    case 'icons':
      return (
        <div style={{ textAlign: p.align, padding: '8px 0', display: 'flex', gap: 16, justifyContent: p.align === 'center' ? 'center' : p.align === 'right' ? 'flex-end' : 'flex-start', flexWrap: 'wrap' }}>
          {p.icons.map((ic, i) => (
            <span key={i} style={{ fontSize: p.size }}>{ic}</span>
          ))}
        </div>
      );

    case 'menu':
      return (
        <div style={{ textAlign: p.align, padding: '8px 0', display: 'flex', gap: 20, justifyContent: p.align === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
          {p.links.map((l, i) => (
            <a key={i} href={l.url} style={{ color: p.color, textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{l.label}</a>
          ))}
        </div>
      );

    case 'sticker':
      return (
        <div style={{ textAlign: p.align, padding: '8px 0' }}>
          <span style={{ fontSize: p.size }}>{p.emoji}</span>
        </div>
      );

    case 'gif':
      return (
        <div style={{ textAlign: 'center', padding: '4px 0' }}>
          {p.src ? (
            <img src={p.src} alt={p.alt} style={{ width: p.width, display: 'inline-block' }} />
          ) : (
            <div style={{
              width: '100%', height: 140, background: '#1a1a1a', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px dashed #333', color: '#555', fontSize: 13
            }}>
              GIF URL not set
            </div>
          )}
        </div>
      );

    default:
      return <div style={{ color: '#555', fontSize: 13 }}>Unknown block: {type}</div>;
  }
}

// Generates the email HTML export string
export function generateEmailHTML(blocks, title) {
  const bodyContent = blocks.map(block => blockToHTML(block)).join('\n');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title || 'Email'}</title>
<style>
body{margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
.wrapper{max-width:600px;margin:0 auto;background:#ffffff;}
.content{padding:32px 40px;}
a{color:#7c3aed;}
</style>
</head>
<body>
<div class="wrapper">
<div class="content">
${bodyContent}
</div>
<div style="text-align:center;padding:16px;font-size:11px;color:#aaa;border-top:1px solid #eee;">Designed with Slayte</div>
</div>
</body>
</html>`;
}

function blockToHTML(block) {
  const { type, props: p } = block;
  switch (type) {
    case 'title':
      return `<h1 style="font-size:${p.fontSize}px;font-weight:${p.fontWeight};color:${p.color};text-align:${p.align};margin:0 0 16px;">${p.text}</h1>`;
    case 'paragraph':
      return `<p style="font-size:${p.fontSize}px;color:${p.color};text-align:${p.align};line-height:${p.lineHeight};margin:0 0 12px;">${p.text}</p>`;
    case 'list':
      const tag = p.style === 'bullet' ? 'ul' : 'ol';
      const items = p.items.map(i => `<li style="font-size:${p.fontSize}px;color:${p.color};margin-bottom:4px;">${i}</li>`).join('');
      return `<${tag} style="margin:0 0 12px;padding-left:20px;">${items}</${tag}>`;
    case 'image':
      return p.src ? `<div style="text-align:center;"><img src="${p.src}" alt="${p.alt}" style="width:${p.width};border-radius:${p.borderRadius}px;display:inline-block;"/></div>` : '';
    case 'button':
      return `<div style="text-align:${p.align};margin:16px 0;"><a href="${p.href}" style="display:inline-block;background:${p.bgColor};color:${p.textColor};padding:12px 28px;border-radius:${p.borderRadius}px;font-size:${p.fontSize}px;font-weight:600;text-decoration:none;">${p.text}</a></div>`;
    case 'divider':
      return `<hr style="border:none;border-top:${p.thickness}px solid ${p.color};margin:${p.margin}px 0;"/>`;
    case 'spacer':
      return `<div style="height:${p.height}px;"></div>`;
    case 'social':
      const socLinks = p.links.map(l => `<a href="${l.url}" style="display:inline-block;margin:0 6px;color:#5DCAA5;font-size:13px;text-decoration:none;">${l.platform}</a>`).join('');
      return `<div style="text-align:${p.align};margin:12px 0;">${socLinks}</div>`;
    case 'html':
      return p.code;
    case 'sticker':
    case 'icons':
      return `<div style="text-align:${p.align};font-size:${p.size || p.fontSize}px;margin:8px 0;">${p.emoji || p.icons?.join(' ')}</div>`;
    case 'menu':
      const menuLinks = p.links.map(l => `<a href="${l.url}" style="display:inline-block;margin:0 10px;color:${p.color};font-size:14px;text-decoration:none;font-weight:500;">${l.label}</a>`).join('');
      return `<div style="text-align:${p.align};margin:12px 0;">${menuLinks}</div>`;
    case 'table':
      const headers = p.headers.map(h => `<th style="border:1px solid ${p.borderColor};padding:8px 12px;background:#f9f9f9;font-weight:600;">${h}</th>`).join('');
      const rows = p.data.map(row => `<tr>${row.map(cell => `<td style="border:1px solid ${p.borderColor};padding:8px 12px;">${cell}</td>`).join('')}</tr>`).join('');
      return `<table width="100%" style="border-collapse:collapse;font-size:14px;margin:8px 0;"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    default:
      return '';
  }
}

export function SlayteLogo({ className = "", size = 28 }) {
  const hexScale = size / 72;
  const textSize = size * 0.62;
  
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Hex Mark */}
      <svg width={size} height={size} viewBox="0 0 80 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer hex */}
        <polygon points="40,0 72,18 72,54 40,72 8,54 8,18" fill="#111111" />
        {/* Middle hex — teal outline */}
        <polygon points="40,12 62,24 62,48 40,60 18,48 18,24" fill="none" stroke="#5DCAA5" strokeWidth="2"/>
        {/* Inner hex — solid teal */}
        <polygon points="40,20 54,28 54,44 40,52 26,44 26,28" fill="#5DCAA5" />
      </svg>

      {/* Wordmark */}
      <span 
        className="font-serif font-bold tracking-tighter text-foreground" 
        style={{ fontSize: textSize, lineHeight: 1 }}
      >
        slayte
        <span className="text-[#5DCAA5]">.</span>
      </span>
    </div>
  );
}

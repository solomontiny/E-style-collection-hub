interface LogoProps {
  className?: string;
  textColor?: string;
}

export default function Logo({ className = '', textColor = 'text-white' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Logo Icon */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
        {/* E with gold accent */}
        <g>
          {/* Black strokes */}
          <path d="M8 6h14v2H8V6z" fill="currentColor" />
          <path d="M8 15h12v2H8v-2z" fill="currentColor" />
          <path d="M8 24h14v2H8v-2z" fill="currentColor" />
          <path d="M8 6v20h2V6H8z" fill="currentColor" />

          {/* Gold accent curve */}
          <path
            d="M16 12C18 12 20 13 20 15C20 17 18 18 16 18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="18.5" cy="15" r="1.5" fill="url(#goldGradient)" />
        </g>

        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col leading-tight">
        <div className={`text-[13px] font-display font-semibold tracking-[0.15em] uppercase ${textColor}`}>
          E Style
        </div>
        <div className={`text-[9px] tracking-[0.25em] uppercase font-medium text-gold-500`}>
          Collection
        </div>
      </div>
    </div>
  );
}

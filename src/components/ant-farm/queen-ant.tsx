type QueenAntProps = {
  className?: string;
};

export function QueenAnt({ className = "" }: QueenAntProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Анимированная муравьиная королева в короне"
    >
      <defs>
        <linearGradient id="queen-body" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="queen-body-dark" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#D97706" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="queen-crown" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="queen-glow">
          <stop stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="queen-shadow-fill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#92400E" />
          <stop offset="1" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="queen-petiole" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#B45309" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
      </defs>

      <circle className="queen-glow" cx="120" cy="96" r="82" fill="url(#queen-glow)" />
      <ellipse className="queen-shadow" cx="120" cy="168" rx="58" ry="6" fill="url(#queen-shadow-fill)" />

      <g className="queen-bob">
        {/* Legs */}
        <g stroke="#9A3412" strokeWidth="4" strokeLinecap="round">
          <path className="queen-leg" style={{ animationDelay: "0s" }} d="M104 92 Q 86 118 68 124" />
          <path className="queen-leg" style={{ animationDelay: "-0.35s" }} d="M108 101 Q 90 136 82 150" />
          <path className="queen-leg" style={{ animationDelay: "-0.7s" }} d="M116 109 Q 108 144 116 156" />
          <path className="queen-leg" style={{ animationDelay: "-0.55s" }} d="M118 92 Q 138 116 154 122" />
          <path className="queen-leg" style={{ animationDelay: "-0.2s" }} d="M124 101 Q 146 134 154 148" />
          <path className="queen-leg" style={{ animationDelay: "-0.85s" }} d="M130 109 Q 152 140 148 154" />
        </g>

        {/* Antennae */}
        <g stroke="#9A3412" strokeWidth="3" strokeLinecap="round">
          <path
            className="queen-antenna"
            style={{ animationDelay: "0s" }}
            d="M58 76 Q 44 56 30 52"
          />
          <path
            className="queen-antenna"
            style={{ animationDelay: "-1.2s" }}
            d="M72 72 Q 66 48 52 38"
          />
        </g>
        <circle cx="30" cy="52" r="3" fill="#FBBF24" />
        <circle cx="52" cy="38" r="3" fill="#FBBF24" />

        {/* Body */}
        <ellipse cx="162" cy="98" rx="42" ry="32" fill="url(#queen-body-dark)" />
        <ellipse cx="112" cy="102" rx="23" ry="20" fill="url(#queen-body)" />
        <ellipse cx="142" cy="100" rx="12" ry="10" fill="url(#queen-petiole)" />
        <circle cx="68" cy="94" r="25" fill="url(#queen-body)" />

        {/* Head details */}
        <circle cx="59" cy="90" r="4.5" fill="#451A03" />
        <circle cx="78" cy="90" r="4.5" fill="#451A03" />
        <circle cx="60.5" cy="88.5" r="1.5" fill="#FFFFFF" />
        <circle cx="79.5" cy="88.5" r="1.5" fill="#FFFFFF" />
        <path d="M62 104 Q 68 110 74 104" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" />

        {/* Crown */}
        <g className="queen-crown">
          <path
            d="M48 66 L 53 46 L 63 57 L 70 40 L 77 57 L 87 46 L 88 66 Z"
            fill="url(#queen-crown)"
            stroke="#B45309"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="70" cy="38" r="3" fill="#FDE68A" />
          <circle cx="53" cy="44" r="2.5" fill="#FDE68A" />
          <circle cx="87" cy="44" r="2.5" fill="#FDE68A" />
        </g>
      </g>
    </svg>
  );
}

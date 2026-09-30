export default function CornetaMark({ size = 34, className = "", mono = false }) {
  const bg = mono ? "#ffffff" : "#0B0F0B";
  const frame = mono ? "#000000" : "#2D3B2D";
  const ink = mono ? "#000000" : "#D4A359";
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="6" fill={bg} />
      <rect x="1.5" y="1.5" width="61" height="61" rx="5" fill="none" stroke={frame} strokeWidth="1.5" />
      <circle cx="27" cy="34" r="13" fill="none" stroke={ink} strokeWidth="4.5" />
      <path d="M37 24 L56 13 L56 51 L37 40 Z" fill={ink} />
      <rect x="12" y="31.5" width="8" height="5" fill={ink} />
    </svg>
  );
}

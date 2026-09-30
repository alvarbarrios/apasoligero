export default function CornetaMark({ size = 34, className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="6" fill="#0B0F0B" />
      <rect x="1.5" y="1.5" width="61" height="61" rx="5" fill="none" stroke="#2D3B2D" strokeWidth="1.5" />
      <circle cx="27" cy="34" r="13" fill="none" stroke="#D4A359" strokeWidth="4.5" />
      <path d="M37 24 L56 13 L56 51 L37 40 Z" fill="#D4A359" />
      <rect x="12" y="31.5" width="8" height="5" fill="#D4A359" />
    </svg>
  );
}

export function OgMonogram({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", top: 72, left: 72 }}>
      <g fill="#F2EFEA"><rect x="16" y="10" width="14" height="80" /><path fillRule="evenodd" d="M30,10 H52 A22,22 0 0 1 52,54 H30 Z M30,24 H52 A8,8 0 0 1 52,40 H30 Z" /><polygon points="42,50 56,50 80,90 66,90" /></g>
      <circle cx="46" cy="32" r="5" fill="#FF4A26" />
    </svg>
  );
}

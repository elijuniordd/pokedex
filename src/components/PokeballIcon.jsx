export default function PokeballIcon({ size = 24, className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#0f172a" strokeWidth="6" />
      <path d="M4 50a46 46 0 0 1 92 0z" fill="#ef4444" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
      <path d="M4 50h92" stroke="#0f172a" strokeWidth="8" />
      <circle cx="50" cy="50" r="14" fill="#f8fafc" stroke="#0f172a" strokeWidth="7" />
      <circle cx="50" cy="50" r="5" fill="#0f172a" />
    </svg>
  );
}

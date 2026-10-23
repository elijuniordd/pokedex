import { MAX_STAT, getStatLevel } from '../utils/pokemon.js';
import '../css/StatBar.css';

// compact: versão pequena do card. semantic: expõe a barra como progressbar (usado no modal)
export default function StatBar({ label, value, compact = false, semantic = false }) {
  const level = getStatLevel(value);
  const width = `${Math.min(value / MAX_STAT, 1) * 100}%`;

  return (
    <li className={`stat-bar${compact ? ' stat-bar--compact' : ''}`}>
      <span className="stat-bar__label">{label}</span>
      <span className="stat-bar__value">{value}</span>
      <div
        className="stat-bar__track"
        {...(semantic
          ? { role: 'progressbar', 'aria-label': label, 'aria-valuenow': value, 'aria-valuemin': 0, 'aria-valuemax': MAX_STAT }
          : { 'aria-hidden': true })}
      >
        <div className={`stat-bar__fill stat-bar__fill--${level}`} style={{ width }} />
      </div>
    </li>
  );
}

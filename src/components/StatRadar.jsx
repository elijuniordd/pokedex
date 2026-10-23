import { STATS } from '../utils/pokemon.js';
import '../css/StatRadar.css';

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 80;
const LABEL_RADIUS = RADIUS + 20;
const RADAR_MAX = 140; // valores acima disso ficam no limite do gráfico
const RINGS = [0.25, 0.5, 0.75, 1];

// Ponto no eixo `index` (0 = topo, sentido horário) a uma fração do raio
const pointAt = (index, fraction, radius = RADIUS) => {
  const angle = (Math.PI * 2 * index) / STATS.length - Math.PI / 2;
  return [CENTER + Math.cos(angle) * radius * fraction, CENTER + Math.sin(angle) * radius * fraction];
};

const toPoints = (points) => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

export default function StatRadar({ stats, name }) {
  const dataPoints = STATS.map(({ key }, index) => pointAt(index, Math.min((stats[key] ?? 0) / RADAR_MAX, 1)));
  const description = `Gráfico de atributos de ${name}: ${STATS.map(({ label, key }) => `${label} ${stats[key] ?? 0}`).join(', ')}`;

  return (
    <svg className="stat-radar" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={description}>
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          className="stat-radar__ring"
          points={toPoints(STATS.map((_, index) => pointAt(index, ring)))}
        />
      ))}
      {STATS.map(({ key }, index) => {
        const [x, y] = pointAt(index, 1);
        return <line key={key} className="stat-radar__axis" x1={CENTER} y1={CENTER} x2={x} y2={y} />;
      })}

      <polygon className="stat-radar__area" points={toPoints(dataPoints)} />
      {dataPoints.map(([x, y], index) => (
        <circle key={STATS[index].key} className="stat-radar__dot" cx={x} cy={y} r="3.5" />
      ))}

      {STATS.map(({ key, abbr }, index) => {
        const [x, y] = pointAt(index, 1, LABEL_RADIUS);
        return (
          <text key={key} className="stat-radar__label" x={x} y={y} textAnchor="middle" dominantBaseline="middle">
            {abbr}
          </text>
        );
      })}
    </svg>
  );
}

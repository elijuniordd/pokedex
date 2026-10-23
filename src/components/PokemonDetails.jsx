import { useRef, useState } from 'react';
import StarIcon from './StarIcon.jsx';
import StatBar from './StatBar.jsx';
import StatRadar from './StatRadar.jsx';
import useModal from '../hooks/useModal.js';
import { FALLBACK_SRC, STATS, capitalize, formatId, getArtworkUrl, getStats, getTypes } from '../utils/pokemon.js';
import '../css/PokemonDetails.css';

export default function PokemonDetails({ pokemon, isFavorite = false, onToggleFavorite, onClose }) {
  const [failedImageId, setFailedImageId] = useState(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  const { id } = pokemon;
  const name = capitalize(pokemon.name);
  const types = getTypes(pokemon);
  const stats = getStats(pokemon);
  const primaryType = types[0] ?? 'normal';
  const imageSrc = failedImageId === id ? FALLBACK_SRC : getArtworkUrl(id);
  const total = STATS.reduce((sum, { key }) => sum + (stats[key] ?? 0), 0);

  useModal(dialogRef, closeButtonRef, onClose);

  return (
    <div className="pokemon-details__overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className={`pokemon-details pokemon-card--${primaryType}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pokemon-details__actions">
          <button
            type="button"
            className="pokemon-details__icon-button pokemon-details__favorite"
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
            onClick={() => onToggleFavorite?.(id)}
          >
            <StarIcon filled={isFavorite} />
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            className="pokemon-details__icon-button"
            aria-label="Fechar detalhes"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="pokemon-details__hero">
          <img
            className="pokemon-details__image"
            src={imageSrc}
            alt={name}
            width="475"
            height="475"
            decoding="async"
            onError={() => setFailedImageId(id)}
          />
        </div>

        <div className="pokemon-details__content">
          <span className="pokemon-details__id">{formatId(id)}</span>
          <h2 id="pokemon-details-title" className="pokemon-details__name">
            {name}
          </h2>

          <ul className="pokemon-card__types pokemon-details__types" aria-label="Tipos">
            {types.map((type) => (
              <li key={type} className={`type-badge type-badge--${type}`}>
                {capitalize(type)}
              </li>
            ))}
          </ul>

          <section className="pokemon-details__stats-section" aria-labelledby="pokemon-details-stats">
            <div className="pokemon-details__stats-header">
              <h3 id="pokemon-details-stats">Atributos</h3>
              <span className="pokemon-details__total">
                Total <strong>{total}</strong>
              </span>
            </div>

            <div className="pokemon-details__stats-body">
              <ul className="pokemon-details__stats">
                {STATS.map(({ key, label }) => (
                  <StatBar key={key} label={label} value={stats[key] ?? 0} semantic />
                ))}
              </ul>
              <StatRadar stats={stats} name={name} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

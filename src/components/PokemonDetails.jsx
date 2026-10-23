import { useEffect, useRef, useState } from 'react';
import StarIcon from './StarIcon.jsx';
import { FALLBACK_SRC, capitalize, formatId, getArtworkUrl, getStats, getTypes } from '../utils/pokemon.js';
import '../css/PokemonDetails.css';

const MAX_STAT = 255; // maior valor base possível num atributo

const STAT_LABELS = [
  ['hp', 'HP'],
  ['attack', 'Attack'],
  ['defense', 'Defense'],
  ['specialAttack', 'Special Attack'],
  ['specialDefense', 'Special Defense'],
  ['speed', 'Speed'],
];

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const getStatLevel = (value) => (value < 50 ? 'low' : value < 90 ? 'medium' : 'high');

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

  // Bloqueia o scroll da página, move o foco para o modal e devolve-o ao fechar
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }

    // Mantém o Tab dentro do modal
    if (event.key === 'Tab') {
      const focusable = dialogRef.current.querySelectorAll(FOCUSABLE);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="pokemon-details__overlay" onClick={onClose} onKeyDown={handleKeyDown}>
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

          <ul className="pokemon-details__stats" aria-label="Atributos">
            {STAT_LABELS.map(([key, label]) => {
              const value = stats[key] ?? 0;
              return (
                <li key={key} className="pokemon-details__stat">
                  <span className="pokemon-details__stat-label">{label}</span>
                  <span className="pokemon-details__stat-value">{value}</span>
                  <div
                    className="pokemon-details__bar"
                    role="progressbar"
                    aria-label={label}
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={MAX_STAT}
                  >
                    <div
                      className={`pokemon-details__bar-fill pokemon-details__bar-fill--${getStatLevel(value)}`}
                      style={{ width: `${Math.min(value / MAX_STAT, 1) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

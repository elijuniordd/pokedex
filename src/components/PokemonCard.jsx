import { memo, useState } from 'react';
import '../css/PokemonCard.css';

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Pokébola em SVG embutido, usada quando a imagem oficial não carrega
const FALLBACK_SRC = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<circle cx="50" cy="50" r="46" fill="#334155" stroke="#475569" stroke-width="4"/>' +
    '<path d="M4 50h92" stroke="#475569" stroke-width="6"/>' +
    '<circle cx="50" cy="50" r="14" fill="#1e293b" stroke="#475569" stroke-width="6"/>' +
    '</svg>',
)}`;

const formatId = (id) => `#${String(id).padStart(3, '0')}`;

const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// Aceita o formato do pokedex-data.json (types: [{ name }]) e o formato simples (type: ['fire'])
const getTypes = (pokemon) => {
  const raw = pokemon.types ?? pokemon.type ?? [];
  return raw.map((t) => (typeof t === 'string' ? t : t.name).toLowerCase());
};

// Aceita stats aninhados (pokemon.stats.hp) ou no primeiro nível (pokemon.hp)
const getStats = (pokemon) => pokemon.stats ?? pokemon;

function StarIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M12 2.5l2.94 5.96 6.56.95-4.75 4.63 1.12 6.54L12 17.5l-5.87 3.08 1.12-6.54L2.5 9.41l6.56-.95L12 2.5z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PokemonCard({ pokemon, onSelect, isFavorite = false, onToggleFavorite }) {
  // Guarda o id cuja imagem falhou: ao mudar de Pokémon a imagem volta a ser tentada
  const [failedImageId, setFailedImageId] = useState(null);

  const { id } = pokemon;
  const name = capitalize(pokemon.name);
  const types = getTypes(pokemon);
  const { hp, attack, defense } = getStats(pokemon);
  const primaryType = types[0] ?? 'normal';
  const imageSrc = failedImageId === id ? FALLBACK_SRC : `${ARTWORK_BASE_URL}/${id}.png`;

  const handleSelect = () => onSelect?.(pokemon);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const handleFavoriteClick = (event) => {
    event.stopPropagation();
    onToggleFavorite?.(pokemon.id);
  };

  // Evita que Enter/Espaço na estrela cheguem ao onKeyDown do card
  const handleFavoriteKeyDown = (event) => event.stopPropagation();

  return (
    <article
      className={`pokemon-card pokemon-card--${primaryType}`}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${name}`}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      <header className="pokemon-card__header">
        <span className="pokemon-card__id">{formatId(id)}</span>
        <button
          type="button"
          className="pokemon-card__favorite"
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
          onClick={handleFavoriteClick}
          onKeyDown={handleFavoriteKeyDown}
        >
          <StarIcon filled={isFavorite} />
        </button>
      </header>

      <div className="pokemon-card__image-wrapper">
        <img
          className="pokemon-card__image"
          src={imageSrc}
          alt={name}
          width="475"
          height="475"
          loading="lazy"
          decoding="async"
          onError={() => setFailedImageId(id)}
        />
      </div>

      <h3 className="pokemon-card__name">{name}</h3>

      <ul className="pokemon-card__types" aria-label="Tipos">
        {types.map((type) => (
          <li key={type} className={`type-badge type-badge--${type}`}>
            {capitalize(type)}
          </li>
        ))}
      </ul>

      <dl className="pokemon-card__stats">
        <div className="pokemon-card__stat pokemon-card__stat--hp">
          <dt>HP</dt>
          <dd>{hp}</dd>
        </div>
        <div className="pokemon-card__stat pokemon-card__stat--attack">
          <dt>Ataque</dt>
          <dd>{attack}</dd>
        </div>
        <div className="pokemon-card__stat pokemon-card__stat--defense">
          <dt>Defesa</dt>
          <dd>{defense}</dd>
        </div>
      </dl>
    </article>
  );
}

export default memo(PokemonCard);

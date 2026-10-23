import { memo, useState } from 'react';
import StarIcon from './StarIcon.jsx';
import { FALLBACK_SRC, capitalize, formatId, getArtworkUrl, getStats, getTypes } from '../utils/pokemon.js';
import '../css/PokemonCard.css';

// [chave em pokemon.stats, rótulo curto para caber no card, classe de cor]
const CARD_STATS = [
  ['hp', 'HP', 'hp'],
  ['attack', 'Ataque', 'attack'],
  ['defense', 'Defesa', 'defense'],
  ['specialAttack', 'Atq. Esp.', 'special-attack'],
  ['specialDefense', 'Def. Esp.', 'special-defense'],
  ['speed', 'Veloc.', 'speed'],
];

function PokemonCard({ pokemon, onSelect, isFavorite = false, onToggleFavorite }) {
  // Guarda o id cuja imagem falhou: ao mudar de Pokémon a imagem volta a ser tentada
  const [failedImageId, setFailedImageId] = useState(null);

  const { id } = pokemon;
  const name = capitalize(pokemon.name);
  const types = getTypes(pokemon);
  const stats = getStats(pokemon);
  const primaryType = types[0] ?? 'normal';
  const imageSrc = failedImageId === id ? FALLBACK_SRC : getArtworkUrl(id);

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
        {CARD_STATS.map(([key, label, modifier]) => (
          <div key={key} className={`pokemon-card__stat pokemon-card__stat--${modifier}`}>
            <dt>{label}</dt>
            <dd>{stats[key]}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default memo(PokemonCard);

import { memo, useState } from 'react';
import { capitalize, getArtworkUrl, slugify } from '../utils/pokemon.js';
import '../css/TrainerCard.css';

const MAX_BADGE_SLOTS = 8;

// Fotos locais: src/assets/images/trainers/<nome-do-treinador>.(png|jpg|jpeg|webp|svg)
const trainerPhotos = import.meta.glob('../assets/images/trainers/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const findPhoto = (name) => {
  const slug = slugify(name);
  const entry = Object.entries(trainerPhotos).find(([path]) => path.replace(/^.*\/|\.[^.]+$/g, '') === slug);
  return entry?.[1] ?? null;
};

function TrainerCard({ trainer, pokemons, onSelectPokemon }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = photoFailed ? null : findPhoto(trainer.name);

  return (
    <article className="trainer-card">
      <header className="trainer-card__header">
        <div className="trainer-card__avatar">
          {photo ? (
            <img src={photo} alt={trainer.name} loading="lazy" onError={() => setPhotoFailed(true)} />
          ) : (
            <span aria-hidden="true">{trainer.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <h3 className="trainer-card__name">{trainer.name}</h3>
          <p className="trainer-card__badges-count">
            {trainer.badges} {trainer.badges === 1 ? 'insígnia' : 'insígnias'}
          </p>
        </div>
      </header>

      <div className="trainer-card__badges" aria-hidden="true">
        {Array.from({ length: MAX_BADGE_SLOTS }, (_, index) => (
          <span
            key={index}
            className={`trainer-card__badge${index < trainer.badges ? ' trainer-card__badge--earned' : ''}`}
          />
        ))}
      </div>

      <h4 className="trainer-card__subtitle">Pokémon ({pokemons.length})</h4>
      <ul className="trainer-card__team">
        {pokemons.map((pokemon, index) => (
          // O mesmo Pokémon pode aparecer mais de uma vez na equipa, por isso o índice na key
          <li key={`${pokemon.id}-${index}`}>
            <button
              type="button"
              className="trainer-card__pokemon"
              onClick={() => onSelectPokemon(pokemon)}
              aria-label={`Ver detalhes de ${capitalize(pokemon.name)}`}
              title={capitalize(pokemon.name)}
            >
              <img src={getArtworkUrl(pokemon.id)} alt="" width="475" height="475" loading="lazy" decoding="async" />
              <span>{capitalize(pokemon.name)}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default memo(TrainerCard);

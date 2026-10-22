import PokemonCard from './PokemonCard.jsx';
import '../css/PokemonList.css';

export default function PokemonList({ pokemons, favorites, onSelect, onToggleFavorite }) {
  if (pokemons.length === 0) {
    return (
      <div className="pokemon-list__empty" role="status">
        <p className="pokemon-list__empty-title">Nenhum Pokémon encontrado</p>
        <p className="pokemon-list__empty-text">Tente ajustar a pesquisa ou os filtros.</p>
      </div>
    );
  }

  return (
    <section className="pokemon-grid" aria-label="Lista de Pokémon">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onSelect={onSelect}
          isFavorite={favorites.has(pokemon.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}

import { useState } from 'react';
import pokedexData from './data/pokedex-data.json';
import PokemonList from './components/PokemonList.jsx';
import './css/App.css';

const pokemons = pokedexData.pokemon;

export default function App() {
  const [favorites, setFavorites] = useState(() => new Set());

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Pokédex</h1>
        <p className="app__subtitle">
          {pokemons.length} Pokémon · {favorites.size} favoritos
        </p>
      </header>

      <main>
        <PokemonList
          pokemons={pokemons}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
}

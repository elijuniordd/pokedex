import { useState } from 'react';
import pokedexData from './data/pokedex-data.json';
import SearchBar from './components/SearchBar.jsx';
import TypeFilter from './components/TypeFilter.jsx';
import PokemonList from './components/PokemonList.jsx';
import './css/App.css';

const pokemons = pokedexData.pokemon;

// Apenas os tipos usados por algum Pokémon (o "Typeless" do JSON fica de fora)
const availableTypes = [...new Set(pokemons.flatMap((p) => p.types.map((t) => t.name)))];

// Aceita "bulba", "25", "025" e "#025"
const matchesSearch = (pokemon, search) => {
  const query = search.trim().toLowerCase().replace(/^#/, '');
  if (!query) return true;
  return pokemon.name.toLowerCase().includes(query) || String(pokemon.id).padStart(3, '0').includes(query);
};

export default function App() {
  const [favorites, setFavorites] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      matchesSearch(pokemon, search) &&
      (selectedType === '' || pokemon.types.some((t) => t.name === selectedType)),
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Pokédex</h1>
        <p className="app__subtitle">
          {filteredPokemons.length} de {pokemons.length} Pokémon · {favorites.size} favoritos
        </p>
      </header>

      <section className="app__controls">
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter types={availableTypes} selectedType={selectedType} onChange={setSelectedType} />
      </section>

      <main>
        <PokemonList
          pokemons={filteredPokemons}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
    </div>
  );
}

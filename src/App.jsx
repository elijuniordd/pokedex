import { useState } from 'react';
import pokedexData from './data/pokedex-data.json';
import PokemonCard from './components/PokemonCard.jsx';
import './App.css';

export default function App() {
  const [favorites, setFavorites] = useState(new Set());
  const toggle = (id) => setFavorites((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <div className="pokemon-grid" style={{ padding: 24 }}>
      {[...pokedexData.pokemon, { id: 99999, name: 'missingno', stats: { hp: 1, attack: 1, defense: 1 }, types: [] }].map((p) => (
        <PokemonCard key={p.id} pokemon={p} onSelect={(x) => console.log('[card] select', x.name)} isFavorite={favorites.has(p.id)} onToggleFavorite={toggle} />
      ))}
    </div>
  );
}

import pokedexData from './data/pokedex-data.json';
import './App.css';

export default function App() {
  // Ajuste a chave conforme o JSON ('pokemon', 'pokemons' ou se for um array direto)
  const pokemons = pokedexData.pokemon || pokedexData.pokemons || pokedexData;
  const trainers = pokedexData.trainers || pokedexData.treinadores || [];

  return (
    <div style={{ padding: '24px' }}>
      <h1>Pokédex Interativa</h1>
      <p>Total de Pokémon carregados: <strong>{pokemons.length}</strong></p>
      <p>Total de Treinadores: <strong>{trainers.length}</strong></p>

      <ul>
        {pokemons.slice(0, 5).map((p) => (
          <li key={p.id}>
            #{p.id} - {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
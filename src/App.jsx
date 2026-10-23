import { useState } from 'react';
import pokedexData from './data/pokedex-data.json';
import SearchBar from './components/SearchBar.jsx';
import TypeFilter from './components/TypeFilter.jsx';
import PokemonList from './components/PokemonList.jsx';
import TrainerList from './components/TrainerList.jsx';
import PokemonDetails from './components/PokemonDetails.jsx';
import AuthModal from './components/AuthModal.jsx';
import AppHeader from './components/AppHeader.jsx';
import useAuth from './hooks/useAuth.js';
import useFavorites from './hooks/useFavorites.js';
import { isSupabaseConfigured } from './lib/supabase.js';
import { signOut } from './services/auth.js';
import './css/App.css';

const pokemons = pokedexData.pokemon;
const trainers = pokedexData.trainers;
const pokemonsById = new Map(pokemons.map((p) => [p.id, p]));

// Apenas os tipos usados por algum Pokémon (o "Typeless" do JSON fica de fora)
const availableTypes = [...new Set(pokemons.flatMap((p) => p.types.map((t) => t.name)))];

// Aceita "bulba", "25", "025" e "#025"
const matchesSearch = (pokemon, search) => {
  const query = search.trim().toLowerCase().replace(/^#/, '');
  if (!query) return true;
  return pokemon.name.toLowerCase().includes(query) || String(pokemon.id).padStart(3, '0').includes(query);
};

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [view, setView] = useState('pokemon');
  const [authMessage, setAuthMessage] = useState(null); // string = modal de login aberto
  const [notice, setNotice] = useState('');

  const { user } = useAuth();
  const { favorites, toggleFavorite, error: favoritesError, clearError } = useFavorites(user);

  const openLogin = (message = '') => setAuthMessage(message);

  const handleToggleFavorite = (id) => {
    if (!isSupabaseConfigured) {
      setNotice('Favoritos indisponíveis: o Supabase não está configurado neste projeto.');
    } else if (!user) {
      openLogin('Entre na sua conta para guardar os seus favoritos.');
    } else {
      toggleFavorite(id);
    }
  };

  const handleSignOut = () => {
    signOut().catch(() => setNotice('Não foi possível sair. Tente novamente.'));
  };

  const dismissNotice = () => {
    setNotice('');
    clearError();
  };

  const visibleNotice = notice || favoritesError;
  const favoritePokemons = pokemons.filter((pokemon) => favorites.has(pokemon.id));

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      matchesSearch(pokemon, search) &&
      (selectedType === '' || pokemon.types.some((t) => t.name === selectedType)),
  );

  return (
    <div className="app">
      <AppHeader
        stats={[
          { label: 'Pokémon', value: pokemons.length },
          { label: 'Treinadores', value: trainers.length },
          { label: 'Favoritos', value: favorites.size },
        ]}
        showUserMenu={isSupabaseConfigured}
        user={user}
        onSignInClick={() => openLogin()}
        onSignOutClick={handleSignOut}
      />

      {visibleNotice && (
        <div className="app__notice" role="alert">
          <span>{visibleNotice}</span>
          <button type="button" aria-label="Fechar aviso" onClick={dismissNotice}>
            ×
          </button>
        </div>
      )}

      <nav className="app__tabs" aria-label="Seções">
        <button type="button" className="app__tab" aria-pressed={view === 'pokemon'} onClick={() => setView('pokemon')}>
          Pokémon
        </button>
        <button type="button" className="app__tab" aria-pressed={view === 'trainers'} onClick={() => setView('trainers')}>
          Treinadores
        </button>
        <button type="button" className="app__tab" aria-pressed={view === 'favorites'} onClick={() => setView('favorites')}>
          Favoritos
        </button>
      </nav>

      {view === 'pokemon' && (
        <>
          <section className="app__controls">
            <SearchBar value={search} onChange={setSearch} />
            <TypeFilter types={availableTypes} selectedType={selectedType} onChange={setSelectedType} />
            <p className="app__results" aria-live="polite">
              Mostrando <strong>{filteredPokemons.length}</strong> de {pokemons.length} Pokémon
            </p>
          </section>

          <main>
            <PokemonList
              pokemons={filteredPokemons}
              favorites={favorites}
              onSelect={setSelectedPokemon}
              onToggleFavorite={handleToggleFavorite}
            />
          </main>
        </>
      )}

      {view === 'trainers' && (
        <main>
          <TrainerList trainers={trainers} pokemonsById={pokemonsById} onSelectPokemon={setSelectedPokemon} />
        </main>
      )}

      {view === 'favorites' && (
        <main>
          {!user ? (
            <div className="app__login-prompt" role="status">
              <p className="app__login-prompt-title">Os seus favoritos ficam guardados na sua conta</p>
              {isSupabaseConfigured ? (
                <button type="button" className="user-menu__button user-menu__button--primary" onClick={() => openLogin()}>
                  Entrar para ver os favoritos
                </button>
              ) : (
                <p>Favoritos indisponíveis: o Supabase não está configurado neste projeto.</p>
              )}
            </div>
          ) : (
            <PokemonList
              pokemons={favoritePokemons}
              favorites={favorites}
              onSelect={setSelectedPokemon}
              onToggleFavorite={handleToggleFavorite}
              emptyTitle="Ainda não tem favoritos"
              emptyText="Clique na estrela de um Pokémon para o guardar aqui."
            />
          )}
        </main>
      )}

      {selectedPokemon && (
        <PokemonDetails
          pokemon={selectedPokemon}
          isFavorite={favorites.has(selectedPokemon.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      {authMessage !== null && <AuthModal message={authMessage} onClose={() => setAuthMessage(null)} />}
    </div>
  );
}

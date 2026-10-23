import PokeballIcon from './PokeballIcon.jsx';
import UserMenu from './UserMenu.jsx';
import { getArtworkUrl } from '../utils/pokemon.js';
import '../css/AppHeader.css';

const STARTERS = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 25, name: 'Pikachu' },
];

export default function AppHeader({ stats, showUserMenu, user, onSignInClick, onSignOutClick }) {
  return (
    <header className="app-header">
      <div className="app-header__bar">
        <div className="app-header__brand">
          <PokeballIcon size={32} />
          <span>Pokédex</span>
        </div>
        {showUserMenu && <UserMenu user={user} onSignInClick={onSignInClick} onSignOutClick={onSignOutClick} />}
      </div>

      <div className="app-header__hero">
        <div className="app-header__intro">
          <p className="app-header__eyebrow">Primeira geração</p>
          <h1 className="app-header__title">
            Encontre qualquer <span>Pokémon</span> em segundos
          </h1>
          <p className="app-header__text">
            Pesquise por nome ou número, filtre por tipo, confira os atributos de cada criatura e guarde os seus favoritos.
          </p>

          <dl className="app-header__stats">
            {stats.map(({ label, value }) => (
              <div key={label} className="app-header__stat">
                <dd>{value}</dd>
                <dt>{label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="app-header__showcase" aria-hidden="true">
          <PokeballIcon className="app-header__ball" size={320} />
          {STARTERS.map(({ id }, index) => (
            <img
              key={id}
              className={`app-header__starter app-header__starter--${index + 1}`}
              src={getArtworkUrl(id)}
              alt=""
              width="475"
              height="475"
              decoding="async"
            />
          ))}
        </div>
      </div>
    </header>
  );
}

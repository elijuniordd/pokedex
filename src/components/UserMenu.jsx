import '../css/UserMenu.css';

export default function UserMenu({ user, onSignInClick, onSignOutClick }) {
  if (!user) {
    return (
      <button type="button" className="user-menu__button user-menu__button--primary" onClick={onSignInClick}>
        Entrar
      </button>
    );
  }

  return (
    <div className="user-menu">
      <span className="user-menu__email" title={user.email}>
        {user.email}
      </span>
      <button type="button" className="user-menu__button" onClick={onSignOutClick}>
        Sair
      </button>
    </div>
  );
}

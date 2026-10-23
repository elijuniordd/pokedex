import { useRef, useState } from 'react';
import PokeballIcon from './PokeballIcon.jsx';
import useModal from '../hooks/useModal.js';
import { signIn, signUp, translateAuthError } from '../services/auth.js';
import '../css/AuthModal.css';

const BENEFITS = [
  'Favoritos guardados na sua conta',
  'Acesse de qualquer dispositivo',
  'Só você vê a sua lista',
];

export default function AuthModal({ message, onClose }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const emailRef = useRef(null);

  useModal(dialogRef, emailRef, onClose);

  const isSignUp = mode === 'signup';

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setInfo('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { needsConfirmation } = await signUp(email.trim(), password);
        if (needsConfirmation) {
          setInfo('Conta criada! Confirme o seu e-mail para poder entrar.');
          setMode('signin');
          return;
        }
      } else {
        await signIn(email.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal__overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <aside className="auth-modal__brand">
          <PokeballIcon className="auth-modal__ball" size={220} />
          <div className="auth-modal__brand-content">
            <PokeballIcon size={36} />
            <h3>Sua Pokédex, do seu jeito</h3>
            <ul>
              {BENEFITS.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="auth-modal__panel">
          <button type="button" className="auth-modal__close" aria-label="Fechar" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <div className="auth-modal__tabs" role="group" aria-label="Acesso">
            <button type="button" aria-pressed={!isSignUp} onClick={() => changeMode('signin')}>
              Entrar
            </button>
            <button type="button" aria-pressed={isSignUp} onClick={() => changeMode('signup')}>
              Criar conta
            </button>
          </div>

          <h2 id="auth-modal-title" className="auth-modal__title">
            {isSignUp ? 'Crie a sua conta' : 'Bem-vindo de volta'}
          </h2>
          <p className="auth-modal__message">
            {message || (isSignUp ? 'Leva menos de um minuto.' : 'Entre para acessar os seus favoritos.')}
          </p>

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            <label className="auth-modal__field">
              <span>E-mail</span>
              <div className="auth-modal__input">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M4 6h16v12H4zM4 7l8 6 8-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="auth-modal__field">
              <span>Senha</span>
              <div className="auth-modal__input">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isSignUp ? 'Mínimo de 6 caracteres' : 'Sua senha'}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-modal__toggle"
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>

            {error && (
              <p className="auth-modal__feedback auth-modal__feedback--error" role="alert">
                {error}
              </p>
            )}
            {info && (
              <p className="auth-modal__feedback auth-modal__feedback--info" role="status">
                {info}
              </p>
            )}

            <button type="submit" className="auth-modal__submit" disabled={submitting}>
              {submitting && <span className="auth-modal__spinner" aria-hidden="true" />}
              {submitting ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from 'react';
import useModal from '../hooks/useModal.js';
import { signIn, signUp, translateAuthError } from '../services/auth.js';
import '../css/AuthModal.css';

export default function AuthModal({ message, onClose }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const emailRef = useRef(null);

  useModal(dialogRef, emailRef, onClose);

  const isSignUp = mode === 'signup';

  const switchMode = () => {
    setMode(isSignUp ? 'signin' : 'signup');
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
        <button type="button" className="auth-modal__close" aria-label="Fechar" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h2 id="auth-modal-title" className="auth-modal__title">
          {isSignUp ? 'Criar conta' : 'Entrar'}
        </h2>
        {message && <p className="auth-modal__message">{message}</p>}

        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <label className="auth-modal__field">
            E-mail
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-modal__field">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
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
            {submitting ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <p className="auth-modal__switch">
          {isSignUp ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
          <button type="button" onClick={switchMode}>
            {isSignUp ? 'Entrar' : 'Criar conta'}
          </button>
        </p>
      </div>
    </div>
  );
}

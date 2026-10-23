import { supabase } from '../lib/supabase.js';

const ERROR_MESSAGES = [
  ['invalid login credentials', 'E-mail ou senha incorretos.'],
  ['user already registered', 'Este e-mail já está cadastrado. Tente entrar.'],
  ['at least 6 characters', 'A senha precisa ter pelo menos 6 caracteres.'],
  ['unable to validate email', 'E-mail inválido.'],
  ['email not confirmed', 'Confirme o seu e-mail antes de entrar.'],
  ['rate limit', 'Muitas tentativas. Aguarde um pouco e tente de novo.'],
  ['failed to fetch', 'Sem ligação ao servidor. Verifique a sua internet.'],
];

export const translateAuthError = (error) => {
  const message = (error?.message ?? '').toLowerCase();
  const match = ERROR_MESSAGES.find(([text]) => message.includes(text));
  return match ? match[1] : 'Não foi possível concluir. Tente novamente.';
};

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  // Sem sessão = o projeto exige confirmação por e-mail
  return { needsConfirmation: !data.session };
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

// Devolve a função que cancela a subscrição
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
  return () => data.subscription.unsubscribe();
}

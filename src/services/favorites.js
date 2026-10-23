import { supabase } from '../lib/supabase.js';

// O user_id é preenchido pelo banco (auth.uid()) e as regras de RLS isolam cada utilizador
export async function fetchFavorites() {
  const { data, error } = await supabase.from('favorites').select('pokemon_id');
  if (error) throw error;
  return data.map((row) => row.pokemon_id);
}

export async function addFavorite(pokemonId) {
  const { error } = await supabase.from('favorites').insert({ pokemon_id: pokemonId });
  if (error) throw error;
}

export async function removeFavorite(pokemonId) {
  const { error } = await supabase.from('favorites').delete().eq('pokemon_id', pokemonId);
  if (error) throw error;
}

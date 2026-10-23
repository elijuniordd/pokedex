import { useCallback, useEffect, useState } from 'react';
import { addFavorite, fetchFavorites, removeFavorite } from '../services/favorites.js';

const EMPTY = new Set();

// Os favoritos pertencem a um utilizador: a lista guarda o id de quem é dono dela,
// por isso ao sair (ou trocar de conta) a lista antiga deixa de ser mostrada
export default function useFavorites(user) {
  const [stored, setStored] = useState({ userId: null, ids: EMPTY });
  const [error, setError] = useState('');

  const userId = user?.id ?? null;
  const favorites = stored.userId === userId ? stored.ids : EMPTY;

  useEffect(() => {
    if (!userId) return undefined;

    let active = true;
    fetchFavorites()
      .then((ids) => active && setStored({ userId, ids: new Set(ids) }))
      .catch(() => active && setError('Não foi possível carregar os seus favoritos.'));

    return () => {
      active = false;
    };
  }, [userId]);

  const setFavoriteLocally = useCallback(
    (id, isFavorite) => {
      setStored((prev) => {
        const next = new Set(prev.userId === userId ? prev.ids : EMPTY);
        if (isFavorite) next.add(id);
        else next.delete(id);
        return { userId, ids: next };
      });
    },
    [userId],
  );

  const toggleFavorite = useCallback(
    async (id) => {
      if (!userId) return;

      const wasFavorite = favorites.has(id);
      setFavoriteLocally(id, !wasFavorite); // atualiza a tela na hora
      try {
        if (wasFavorite) await removeFavorite(id);
        else await addFavorite(id);
      } catch {
        setFavoriteLocally(id, wasFavorite); // desfaz se o banco falhar
        setError('Não foi possível guardar o favorito. Tente novamente.');
      }
    },
    [userId, favorites, setFavoriteLocally],
  );

  return { favorites, toggleFavorite, error, clearError: () => setError('') };
}

const ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

// Pokébola em SVG embutido, usada quando a imagem oficial não carrega
export const FALLBACK_SRC = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
    '<circle cx="50" cy="50" r="46" fill="#334155" stroke="#475569" stroke-width="4"/>' +
    '<path d="M4 50h92" stroke="#475569" stroke-width="6"/>' +
    '<circle cx="50" cy="50" r="14" fill="#1e293b" stroke="#475569" stroke-width="6"/>' +
    '</svg>',
)}`;

export const getArtworkUrl = (id) => `${ARTWORK_BASE_URL}/${id}.png`;

export const formatId = (id) => `#${String(id).padStart(3, '0')}`;

export const capitalize = (text = '') => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// Aceita o formato do pokedex-data.json (types: [{ name }]) e o formato simples (type: ['fire'])
export const getTypes = (pokemon) => {
  const raw = pokemon.types ?? pokemon.type ?? [];
  return raw.map((t) => (typeof t === 'string' ? t : t.name).toLowerCase());
};

// Aceita stats aninhados (pokemon.stats.hp) ou no primeiro nível (pokemon.hp)
export const getStats = (pokemon) => pokemon.stats ?? pokemon;

// "Lt. Surge" -> "lt-surge" (nome do ficheiro da foto em src/assets/images/trainers)
export const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

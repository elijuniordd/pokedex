import '../css/TypeFilter.css';

// selectedType === '' significa "todos os tipos"
export default function TypeFilter({ types, selectedType, onChange }) {
  return (
    <div className="type-filter" role="group" aria-label="Filtrar por tipo">
      <button
        type="button"
        className="type-filter__button"
        aria-pressed={selectedType === ''}
        onClick={() => onChange('')}
      >
        Todos
      </button>
      {types.map((type) => (
        <button
          key={type}
          type="button"
          className={`type-filter__button type-badge--${type.toLowerCase()}`}
          aria-pressed={selectedType === type}
          onClick={() => onChange(selectedType === type ? '' : type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

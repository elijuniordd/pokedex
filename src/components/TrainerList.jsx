import TrainerCard from './TrainerCard.jsx';
import '../css/TrainerList.css';

export default function TrainerList({ trainers, pokemonsById, onSelectPokemon }) {
  if (trainers.length === 0) {
    return (
      <div className="trainer-list__empty" role="status">
        Nenhum treinador encontrado.
      </div>
    );
  }

  return (
    <section className="trainer-list" aria-label="Lista de treinadores">
      {trainers.map((trainer) => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          pokemons={trainer.pokemonIds.map((id) => pokemonsById.get(id)).filter(Boolean)}
          onSelectPokemon={onSelectPokemon}
        />
      ))}
    </section>
  );
}

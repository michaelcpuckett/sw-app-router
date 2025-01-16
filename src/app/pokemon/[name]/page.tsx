import { GetMetadata, GetStaticProps } from 'app-router/index';
import PokeAPI, {
  EvolutionChain,
  PokemonSpecies,
  PokemonType,
} from 'pokedex-promise-v2';
import { Fragment } from 'react';

export const getStaticProps: GetStaticProps = async function ({
  params: { name },
}) {
  const pokeAPI = new PokeAPI();
  const pokemon = await pokeAPI.getPokemonByName(name);
  const species = await pokeAPI.getPokemonSpeciesByName(name);
  const evolutionChainResourceUrl = species.evolution_chain.url;
  const evolutionChain = await pokeAPI.getResource(evolutionChainResourceUrl);
  const image = pokemon.sprites.other['official-artwork'].front_default;

  if (image) {
    const cache = await caches.open('pokemon-images');
    await cache.add(image);
  }

  const types = pokemon.types;
  const number = pokemon.id;

  const previousPokemon = await pokeAPI
    .getPokemonByName(number - 1)
    .catch(() => null);
  const nextPokemon = await pokeAPI
    .getPokemonByName(number + 1)
    .catch(() => null);

  return {
    image,
    number,
    previousPokemon,
    nextPokemon,
    types,
    name,
    species,
    evolutionChain,
  };
};

export const metadata: GetMetadata = async ({ params: { name } }) => ({
  title: name,
});

export default function PokemonSpeciesPage({
  image,
  types,
  name,
  evolutionChain,
  previousPokemon,
  nextPokemon,
}: {
  image: string;
  types: PokemonType[];
  name: string;
  evolutionChain: EvolutionChain;
  previousPokemon: PokemonSpecies;
  nextPokemon: PokemonSpecies;
}) {
  function renderEvolutionChain(chain) {
    return (
      <li
        key={chain.species.name}
        style={{ display: 'flex' }}
      >
        <a
          className="button"
          href={'/pokemon/' + chain.species.name}
        >
          {chain.species.name}
        </a>
        {chain.evolves_to.length > 0 && (
          <ul>
            {chain.evolves_to.map((evolution) =>
              renderEvolutionChain(evolution),
            )}
          </ul>
        )}
      </li>
    );
  }

  return (
    <Fragment>
      <header>
        <h1>{name}</h1>
      </header>
      <nav style={{ margin: '1em 0', display: 'flex', gap: '1em' }}>
        <a
          className="button"
          href="/pokemon"
        >
          Back
        </a>
        {previousPokemon && (
          <a
            className="button"
            href={'/pokemon/' + previousPokemon.name}
          >
            Previous - {previousPokemon.name}
          </a>
        )}
        {nextPokemon && (
          <a
            className="button"
            href={'/pokemon/' + nextPokemon.name}
          >
            Next - {nextPokemon.name}
          </a>
        )}
      </nav>
      <br />
      <main>
        <h2>Image</h2>
        <img
          src={image}
          alt={name}
        />
        <h2>Types</h2>
        <ul>
          {types.map(({ type }) => (
            <li key={type.name}>{type.name}</li>
          ))}
        </ul>
        <h2>Evolution</h2>
        <ul>{renderEvolutionChain(evolutionChain.chain)}</ul>
      </main>
    </Fragment>
  );
}

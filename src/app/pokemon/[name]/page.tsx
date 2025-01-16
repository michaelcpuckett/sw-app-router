import { GetMetadata, GetStaticProps } from 'app-router/index';
import PokeAPI, {
  Chain,
  EvolutionChain,
  PokemonType,
} from 'pokedex-promise-v2';
import { Fragment } from 'react';

interface PokemonPageProps {
  image: string;
  types: PokemonType[];
  name: string;
  evolutionChain: EvolutionChain;
  previousPokemon?: string;
  nextPokemon?: string;
}

export const getStaticProps: GetStaticProps = async function ({
  params: { name },
}) {
  const pokemonDataCache = await caches.open('pokemon-data');
  const cachedPokemonData = await pokemonDataCache.match(name);

  if (cachedPokemonData) {
    return {
      props: await cachedPokemonData.json(),
    };
  }

  const pokeAPI = new PokeAPI();
  const [pokemon, species] = await Promise.all([
    pokeAPI.getPokemonByName(name),
    pokeAPI.getPokemonSpeciesByName(name),
  ]);
  const evolutionChainResourceUrl = species.evolution_chain.url;
  const evolutionChain = await pokeAPI.getResource(evolutionChainResourceUrl);
  const image = pokemon.sprites.other['official-artwork'].front_default || '';

  if (image) {
    const pokemonImageCache = await caches.open('pokemon-images');
    await pokemonImageCache.add(image);
  }

  const types = pokemon.types;
  const number = pokemon.id;

  const previousPokemon = await pokeAPI
    .getPokemonByName(number - 1)
    .catch(() => null);
  const nextPokemon = await pokeAPI
    .getPokemonByName(number + 1)
    .catch(() => null);

  const props: PokemonPageProps = {
    image,
    previousPokemon: previousPokemon?.name,
    nextPokemon: nextPokemon?.name,
    types,
    name,
    evolutionChain,
  };

  await pokemonDataCache.put(
    name,
    new Response(JSON.stringify(props), {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  );

  return {
    props,
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
}: PokemonPageProps) {
  function renderEvolutionChain(chain: Chain) {
    return (
      <li
        key={chain.species.name}
        style={{
          margin: '1em 0',
          flexWrap: 'wrap',
          display: 'flex',
          gap: '1em',
        }}
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
      <nav
        style={{
          margin: '1em 0',
          flexWrap: 'wrap',
          display: 'flex',
          gap: '1em',
        }}
      >
        <a
          className="button"
          href="/pokemon"
        >
          Back
        </a>
        {previousPokemon && (
          <a
            className="button"
            href={'/pokemon/' + previousPokemon}
          >
            Previous - {previousPokemon}
          </a>
        )}
        {nextPokemon && (
          <a
            className="button"
            href={'/pokemon/' + nextPokemon}
          >
            Next - {nextPokemon}
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

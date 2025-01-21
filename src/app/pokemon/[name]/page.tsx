import { GetMetadata, GetStaticProps } from '@express-worker/router';
import PokeAPI, { Chain, EvolutionChain } from 'pokedex-promise-v2';
import { Fragment } from 'react';

interface PokemonPageProps {
  image: string;
  types: Array<[string, string]>;
  name: string;
  evolutionChain: EvolutionChain;
  previousPokemon?: string;
  nextPokemon?: string;
}

export const getStaticProps: GetStaticProps = async function ({
  params: { name },
}) {
  // Data doesn't change. Check cache first.
  const pagePropsCache = await caches.open('page-props');
  const cachedPokemonData = await pagePropsCache.match('/' + name);

  if (cachedPokemonData) {
    return {
      props: await cachedPokemonData.json(),
    };
  }

  // Fetch data if not in cache.
  const pokeAPI = new PokeAPI();
  const [pokemon, species] = await Promise.all([
    pokeAPI.getPokemonByName(name),
    pokeAPI.getPokemonSpeciesByName(name),
  ]);
  const evolutionChainResourceUrl = species.evolution_chain.url;
  const evolutionChain = await pokeAPI.getResource(evolutionChainResourceUrl);
  const image = pokemon.sprites.other['official-artwork'].front_default || '';

  if (image) {
    // Pre-cache image.
    const pokemonImageCache = await caches.open('pokemon-images');
    await pokemonImageCache.add(image);
  }

  const number = pokemon.id;
  const types = await Promise.all(
    pokemon.types.map(async ({ type }) => {
      const typeData = await pokeAPI.getTypeByName(type.name);
      const iconUrl =
        typeData.sprites['generation-viii'][
          'brilliant-diamond-and-shining-pearl'
        ].name_icon || '';

      const typeUrlCache = await caches.open('type-icons');

      if (!iconUrl) {
        return [type.name, ''] as [string, string];
      }

      if (!(await typeUrlCache.match(iconUrl))) {
        await typeUrlCache.put(iconUrl, await fetch(iconUrl));
      }

      return [type.name, iconUrl] as [string, string];
    }),
  );

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

  await pagePropsCache.put('/' + name, new Response(JSON.stringify(props)));

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
          margin: '0.5em 0',
          flexWrap: 'wrap',
          display: 'flex',
          gap: '1em',
          padding: 0,
        }}
      >
        <a
          className="button"
          style={{
            textTransform: 'capitalize',
          }}
          href={'/pokemon/' + chain.species.name}
        >
          {chain.species.name}
        </a>
        {chain.evolves_to.length > 0 && (
          <ul
            style={{
              display: 'flex',
              gap: '1em',
              listStyle: 'none',
              padding: 0,
              margin: 0,
            }}
          >
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
      <nav
        style={{
          placeSelf: 'center',
          margin: '1em 0',
          display: 'flex',
          padding: '0 1em',
        }}
      >
        <a
          href="/pokemon"
          className="button"
        >
          Back
        </a>
      </nav>
      <nav
        style={{
          placeSelf: 'center',
          margin: '2em 0',
          flexWrap: 'wrap',
          display: 'flex',
          gap: '1em',
          padding: '0 1em',
        }}
      >
        {previousPokemon && (
          <a
            className="button"
            style={{
              textTransform: 'capitalize',
            }}
            href={'/pokemon/' + previousPokemon}
          >
            ← {previousPokemon}
          </a>
        )}
        {nextPokemon && (
          <a
            className="button"
            style={{
              textTransform: 'capitalize',
            }}
            href={'/pokemon/' + nextPokemon}
          >
            {nextPokemon} →
          </a>
        )}
      </nav>
      <hr />
      <header
        style={{
          placeSelf: 'center',
          placeItems: 'center',
          display: 'grid',
          gap: '1em',
          margin: '1em 0',
          alignItems: 'center',
          padding: '0 1em',
        }}
      >
        <h1
          style={{
            margin: '0.25em 0',
            textTransform: 'capitalize',
          }}
        >
          {name}
        </h1>
        <ul
          style={{
            display: 'flex',
            gap: '1em',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
        >
          {types.map(([name, iconUrl]) => {
            return (
              <li key={name}>
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={name}
                  />
                ) : (
                  <span>{name}</span>
                )}
              </li>
            );
          })}
        </ul>
      </header>
      <main
        style={{
          placeSelf: 'center',
          padding: '0 1em',
        }}
      >
        <img
          src={image}
          alt={name}
        />
        <h2
          style={{
            placeSelf: 'center',
          }}
        >
          Evolution
        </h2>
        <ul
          style={{
            placeSelf: 'center',
            flexWrap: 'wrap',
            display: 'flex',
            gap: '0.5em',
            padding: 0,
            margin: 0,
          }}
        >
          {renderEvolutionChain(evolutionChain.chain)}
        </ul>
      </main>
      <hr />
      <nav
        style={{
          placeSelf: 'center',
          margin: '2em 0',
          flexWrap: 'wrap',
          display: 'flex',
          gap: '1em',
          padding: '0 1em',
        }}
      >
        {previousPokemon && (
          <a
            className="button"
            style={{
              textTransform: 'capitalize',
            }}
            href={'/pokemon/' + previousPokemon}
          >
            ← {previousPokemon}
          </a>
        )}
        {nextPokemon && (
          <a
            className="button"
            style={{
              textTransform: 'capitalize',
            }}
            href={'/pokemon/' + nextPokemon}
          >
            {nextPokemon} →
          </a>
        )}
      </nav>
    </Fragment>
  );
}

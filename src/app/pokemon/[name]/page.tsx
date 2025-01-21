import { GetMetadata, GetStaticProps } from '@express-worker/router';
import PokeAPI, { Chain, EvolutionChain } from 'pokedex-promise-v2';
import { Fragment } from 'react';
import { toTitleCase } from 'utils/toTitleCase';
import styles from './page.module.css';

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
    previousPokemon: previousPokemon?.name ?? '',
    nextPokemon: nextPokemon?.name ?? '',
    types,
    name: toTitleCase(name),
    evolutionChain,
  };

  await pagePropsCache.put('/' + name, new Response(JSON.stringify(props)));

  return {
    props,
  };
};

export const metadata: GetMetadata = async ({ params: { name } }) => ({
  title: toTitleCase(name),
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
        className={styles.evolutionChainItem}
      >
        <a
          className="button"
          href={'/pokemon/' + chain.species.name}
        >
          {toTitleCase(chain.species.name)}
        </a>
        {chain.evolves_to.length > 0 && (
          <ul className={styles.evolutionChainSublist}>
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
      <nav className={styles.nav}>
        <a
          href="/pokemon"
          className="button"
        >
          Back
        </a>
      </nav>
      <nav className={styles.breadcrumb}>
        {previousPokemon && (
          <a
            className="button"
            href={'/pokemon/' + previousPokemon}
          >
            ← {toTitleCase(previousPokemon)}
          </a>
        )}
        {nextPokemon && (
          <a
            className="button"
            href={'/pokemon/' + nextPokemon}
          >
            {toTitleCase(nextPokemon)} →
          </a>
        )}
      </nav>
      <hr />
      <header className={styles.header}>
        <h1 className={styles.h1}>{name}</h1>
        <ul className={styles.types}>
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
      <main className={styles.main}>
        <img
          src={image}
          alt={name}
          className={styles.image}
        />
        <h2 className={styles.h2}>Evolution</h2>
        <ul className={styles.evoluionChainList}>
          {renderEvolutionChain(evolutionChain.chain)}
        </ul>
      </main>
      <hr />
      <nav className={styles.breadcrumb}>
        {previousPokemon && (
          <a
            className="button"
            href={'/pokemon/' + previousPokemon}
          >
            ← {toTitleCase(previousPokemon)}
          </a>
        )}
        {nextPokemon && (
          <a
            className="button"
            href={'/pokemon/' + nextPokemon}
          >
            {toTitleCase(nextPokemon)} →
          </a>
        )}
      </nav>
    </Fragment>
  );
}

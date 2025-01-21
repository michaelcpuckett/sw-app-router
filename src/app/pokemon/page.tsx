import PokeAPI, { NamedAPIResourceList } from 'pokedex-promise-v2';
import { Fragment } from 'react';
import { GetStaticProps, Metadata } from 'swarf';
import { toTitleCase } from 'utils/toTitleCase';

export const metadata: Metadata = {
  title: 'Pokemon',
};

export const getStaticProps: GetStaticProps = async function () {
  // Data doesn't change. Check cache first.
  const pagePropsCache = await caches.open('page-props');
  const cachedPokemonData = await pagePropsCache.match('/');

  if (cachedPokemonData) {
    return {
      props: await cachedPokemonData.json(),
    };
  }

  // Fetch data if not in cache.
  const pokeAPI = new PokeAPI();
  const props = {
    speciesList: await pokeAPI.getPokemonSpeciesList(),
  };

  // Save to cache.
  await pagePropsCache.put(
    '/',
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

export default function PokemonPage({
  speciesList,
}: {
  speciesList: NamedAPIResourceList;
}) {
  return (
    <Fragment>
      <header>
        <h1>Pokedex</h1>
      </header>
      <nav>
        <a
          className="button"
          href="/"
        >
          Back
        </a>
      </nav>
      <br />
      <main>
        <ul>
          {speciesList.results.map((species) => (
            <li key={species.name}>
              <a href={`/pokemon/${species.name}`}>
                {toTitleCase(species.name)}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </Fragment>
  );
}

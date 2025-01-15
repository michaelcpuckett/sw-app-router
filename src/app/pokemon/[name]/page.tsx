import { GetStaticProps, Metadata } from 'app-router/index';
import PokeAPI, { NamedAPIResource } from 'pokedex-promise-v2';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'Pokemon',
};

export const getStaticProps: GetStaticProps = async function (params) {
  const pokeAPI = new PokeAPI();
  const species = await pokeAPI.getPokemonByName(params.name);
  const image = species.sprites.other['official-artwork'].front_default;

  if (image) {
    const cache = await caches.open('pokemon-species');
    await cache.add(image);
  }

  return {
    species,
  };
};

export default function PokemonSpeciesPage({
  species,
}: {
  species: NamedAPIResource;
}) {
  return (
    <Fragment>
      <header>
        <h1>{species.name}</h1>
      </header>
      <nav>
        <a
          className="button"
          href="/pokemon"
        >
          Back
        </a>
      </nav>
      <br />
      <main>
        <p>Types: {species.types.map(({ type }) => type.name).join(', ')}</p>
        <img
          src={species.sprites.other['official-artwork'].front_default}
          alt={species.name}
        />
      </main>
    </Fragment>
  );
}

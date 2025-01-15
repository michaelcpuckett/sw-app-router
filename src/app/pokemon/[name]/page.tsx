import { GetStaticProps, Metadata } from 'app-router/index';
import PokeAPI, { PokemonType } from 'pokedex-promise-v2';
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

  const name = species.name;
  const types = species.types;

  return {
    image,
    types,
    name,
  };
};

export default function PokemonSpeciesPage({
  image,
  types,
  name,
}: {
  image: string;
  types: PokemonType[];
  name: string;
}) {
  return (
    <Fragment>
      <header>
        <h1>{name}</h1>
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
        <h2>Types</h2>
        <ul>
          {types.map(({ type }) => (
            <li key={type.name}>{type.name}</li>
          ))}
        </ul>
        <h2>Image</h2>
        <img
          src={image}
          alt={name}
        />
      </main>
    </Fragment>
  );
}

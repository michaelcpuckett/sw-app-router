import { GetStaticProps, Metadata } from 'app-router/index';
import PokeAPI, { NamedAPIResourceList } from 'pokedex-promise-v2';
import { Fragment } from 'react';

export const metadata: Metadata = {
  title: 'Pokemon',
};

export const getStaticProps: GetStaticProps = async function () {
  const pokeAPI = new PokeAPI();

  return {
    speciesList: await pokeAPI.getPokemonSpeciesList(),
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
              <a href={`/pokemon/${species.name}`}>{species.name}</a>
            </li>
          ))}
        </ul>
      </main>
    </Fragment>
  );
}

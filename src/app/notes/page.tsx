import { GetStaticProps, Metadata } from 'app-router/index';
import NoteRow from 'components/NoteRow';
import { LexoRank } from 'lexorank';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { getNotes, Note, setNotesDb } from 'utils/db';
import { v4 as uuid } from 'uuid';

export const metadata: Metadata = {
  title: 'Notes',
};

export const getStaticProps: GetStaticProps = async function () {
  return {
    props: {
      initialNotes: await getNotes(),
    },
  };
};

export default function NotesPage({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote = useCallback(async () => {
    const updatedNotes = Array.from(notes);
    const position =
      notes.length === 0
        ? LexoRank.middle().toString()
        : LexoRank.parse(notes[notes.length - 1].position)
            .genNext()
            .toString();

    updatedNotes.push({
      id: uuid(),
      position,
      text: '',
    });

    setNotes(updatedNotes);
  }, [notes, setNotes]);

  useEffect(() => {
    setNotesDb(notes);
  }, [notes]);

  const orderedNotes = notes.sort((a, b) => {
    return LexoRank.parse(a.position).compareTo(LexoRank.parse(b.position));
  });

  return (
    <Fragment>
      <header>
        <h1>Notes</h1>
        <p>Notes are saved locally to IndexedDB.</p>
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
        <button
          className="button"
          onClick={addNote}
        >
          Add Note
        </button>
        <table>
          <tbody>
            {orderedNotes.map((note, index) => (
              <NoteRow
                key={note.id}
                note={note}
                prevNote={orderedNotes[index - 1]}
                nextNote={orderedNotes[index + 1]}
                setNotes={setNotes}
              />
            ))}
          </tbody>
        </table>
      </main>
    </Fragment>
  );
}

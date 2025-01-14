import { GetStaticProps, Metadata } from 'app-router/index';
import NoteRow from 'components/NoteRow';
import { LexoRank } from 'lexorank';
import { useCallback, useState } from 'react';
import { getNotes, Note, setNotesDb } from 'utils/db';
import { v4 as uuid } from 'uuid';

export const metadata: Metadata = {
  title: 'Home',
  description: 'The home page.',
};

export const getStaticProps: GetStaticProps = async function () {
  return {
    initialNotes: await getNotes(),
  };
};

export default function HomePage({ initialNotes }: { initialNotes: Note[] }) {
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
    setNotesDb(updatedNotes);
  }, [notes, setNotes]);

  const orderedNotes = notes.sort((a, b) => {
    return LexoRank.parse(a.position).compareTo(LexoRank.parse(b.position));
  });

  return (
    <main>
      <h1>Service Worker with App Router Starter</h1>
      <p>
        This is a simple demonstration of a notes app. Notes are saved locally
        to IndexedDB.
      </p>
      <button
        className="button"
        onClick={addNote}
      >
        Add Note
      </button>
      <div
        role="grid"
        aria-label="Todos"
      >
        <div role="rowgroup">
          {orderedNotes.map((note, index) => (
            <NoteRow
              key={note.id}
              note={note}
              prevNote={orderedNotes[index - 1]}
              nextNote={orderedNotes[index + 1]}
              setNotes={setNotes}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

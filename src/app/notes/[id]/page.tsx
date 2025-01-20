import { GetStaticProps, Metadata } from '@express-worker/router';
import MarkdownPreview from 'components/MarkdownPreview';
import {
  FormEventHandler,
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { getNote, Note, setNote as setNoteDb } from 'utils/db';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Note Detail',
  description: 'The note detail page.',
};

export const getStaticProps: GetStaticProps = async function ({ params }) {
  const note = await getNote(params.id);

  if (!note) {
    throw new Error('Note not found.');
  }

  return {
    props: {
      initialNote: note,
    },
  };
};

export default function NoteDetailPage({ initialNote }: { initialNote: Note }) {
  const [note, setNote] = useState<Note>(initialNote);

  const handleInput = useCallback<FormEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setNote({
        ...note,
        text: event.currentTarget.value,
      });
    },
    [note],
  );

  useEffect(() => {
    (async () => {
      setNoteDb(note);
    })();
  }, [note]);

  return (
    <Fragment>
      <header>
        <h1>Note Detail</h1>
      </header>
      <nav>
        <a
          className="button"
          href="/notes"
        >
          Back
        </a>
      </nav>
      <br />
      <main>
        <textarea
          className={styles.textarea}
          defaultValue={note.text}
          onInput={handleInput}
        />
        <MarkdownPreview value={note.text} />
      </main>
    </Fragment>
  );
}

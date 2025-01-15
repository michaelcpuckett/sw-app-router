const Routes = {};

import FilesPage, {
  metadata as FilesPageMetadata,
  getStaticProps as getFilesPageProps,
} from 'app/files/page';

Routes['/files'] = {
  Component: FilesPage,
  getStaticProps: getFilesPageProps,
  metadata: FilesPageMetadata,
};

import NotesPage, {
  getStaticProps as getNotesPageProps,
  metadata as NotesPageMetadata,
} from 'app/notes/page';

Routes['/notes'] = {
  Component: NotesPage,
  getStaticProps: getNotesPageProps,
  metadata: NotesPageMetadata,
};

import NotesIdPage, {
  getStaticProps as getNotesIdPageProps,
  metadata as NotesIdPageMetadata,
} from 'app/notes/[id]/page';

Routes['/notes/[id]'] = {
  Component: NotesIdPage,
  getStaticProps: getNotesIdPageProps,
  metadata: NotesIdPageMetadata,
};

import Page, {
  getStaticProps as getPageProps,
  metadata as PageMetadata,
} from 'app/page';

Routes['/'] = {
  Component: Page,
  getStaticProps: getPageProps,
  metadata: PageMetadata,
};

export default Routes;

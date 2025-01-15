const Routes = {};

      
            import * as FilesPage from 'app/files/page';

            Routes['/files'] = FilesPage;
          

            import * as NotesPage from 'app/notes/page';

            Routes['/notes'] = NotesPage;
          

            import * as NotesIdPage from 'app/notes/[id]/page';

            Routes['/notes/[id]'] = NotesIdPage;
          

            import * as Page from 'app/page';

            Routes['/'] = Page;
          
        
        export default Routes;
      
const Routes = {};

      
            import * as FilesPage from 'app/files/page';

            Routes['/files'] = FilesPage;
          

            import * as NotesPage from 'app/notes/page';

            Routes['/notes'] = NotesPage;
          

            import * as NotesIdPage from 'app/notes/[id]/page';

            Routes['/notes/[id]'] = NotesIdPage;
          

            import * as Page from 'app/page';

            Routes['/'] = Page;
          

            import * as PokemonPage from 'app/pokemon/page';

            Routes['/pokemon'] = PokemonPage;
          

            import * as PokemonNamePage from 'app/pokemon/[name]/page';

            Routes['/pokemon/[name]'] = PokemonNamePage;
          
        
        export default Routes;
      
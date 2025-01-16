const Routes = {};

      
            import * as GalleryPage from 'app/gallery/page';

            Routes['/gallery'] = GalleryPage;
          

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
      
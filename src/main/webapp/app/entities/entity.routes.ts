import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'mylibraryApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'autor',
    data: { pageTitle: 'mylibraryApp.autor.home.title' },
    loadChildren: () => import('./autor/autor.routes'),
  },
  {
    path: 'editora',
    data: { pageTitle: 'mylibraryApp.editora.home.title' },
    loadChildren: () => import('./editora/editora.routes'),
  },
  {
    path: 'usuario',
    data: { pageTitle: 'mylibraryApp.usuario.home.title' },
    loadChildren: () => import('./usuario/usuario.routes'),
  },
  {
    path: 'idioma',
    data: { pageTitle: 'mylibraryApp.idioma.home.title' },
    loadChildren: () => import('./idioma/idioma.routes'),
  },
  {
    path: 'livro',
    data: { pageTitle: 'mylibraryApp.livro.home.title' },
    loadChildren: () => import('./livro/livro.routes'),
  },

  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;

import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { LivroComponent } from './list/livro.component';
import { LivroDetailComponent } from './detail/livro-detail.component';
import { LivroUpdateComponent } from './update/livro-update.component';
import LivroResolve from './route/livro-routing-resolve.service';

const livroRoute: Routes = [
  {
    path: '',
    component: LivroComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LivroDetailComponent,
    resolve: {
      livro: LivroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LivroUpdateComponent,
    resolve: {
      livro: LivroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LivroUpdateComponent,
    resolve: {
      livro: LivroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default livroRoute;

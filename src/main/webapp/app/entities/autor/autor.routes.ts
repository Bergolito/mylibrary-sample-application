import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AutorComponent } from './list/autor.component';
import { AutorDetailComponent } from './detail/autor-detail.component';
import { AutorUpdateComponent } from './update/autor-update.component';
import AutorResolve from './route/autor-routing-resolve.service';

const autorRoute: Routes = [
  {
    path: '',
    component: AutorComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AutorDetailComponent,
    resolve: {
      autor: AutorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AutorUpdateComponent,
    resolve: {
      autor: AutorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AutorUpdateComponent,
    resolve: {
      autor: AutorResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default autorRoute;

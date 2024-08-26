import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { IdiomaComponent } from './list/idioma.component';
import { IdiomaDetailComponent } from './detail/idioma-detail.component';
import { IdiomaUpdateComponent } from './update/idioma-update.component';
import IdiomaResolve from './route/idioma-routing-resolve.service';

const idiomaRoute: Routes = [
  {
    path: '',
    component: IdiomaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: IdiomaDetailComponent,
    resolve: {
      idioma: IdiomaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: IdiomaUpdateComponent,
    resolve: {
      idioma: IdiomaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: IdiomaUpdateComponent,
    resolve: {
      idioma: IdiomaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default idiomaRoute;

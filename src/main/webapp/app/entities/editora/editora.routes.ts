import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EditoraComponent } from './list/editora.component';
import { EditoraDetailComponent } from './detail/editora-detail.component';
import { EditoraUpdateComponent } from './update/editora-update.component';
import EditoraResolve from './route/editora-routing-resolve.service';

const editoraRoute: Routes = [
  {
    path: '',
    component: EditoraComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EditoraDetailComponent,
    resolve: {
      editora: EditoraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EditoraUpdateComponent,
    resolve: {
      editora: EditoraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EditoraUpdateComponent,
    resolve: {
      editora: EditoraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default editoraRoute;

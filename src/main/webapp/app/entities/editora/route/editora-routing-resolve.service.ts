import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEditora } from '../editora.model';
import { EditoraService } from '../service/editora.service';

const editoraResolve = (route: ActivatedRouteSnapshot): Observable<null | IEditora> => {
  const id = route.params['id'];
  if (id) {
    return inject(EditoraService)
      .find(id)
      .pipe(
        mergeMap((editora: HttpResponse<IEditora>) => {
          if (editora.body) {
            return of(editora.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default editoraResolve;

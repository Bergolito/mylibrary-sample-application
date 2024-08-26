import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IIdioma } from '../idioma.model';
import { IdiomaService } from '../service/idioma.service';

const idiomaResolve = (route: ActivatedRouteSnapshot): Observable<null | IIdioma> => {
  const id = route.params['id'];
  if (id) {
    return inject(IdiomaService)
      .find(id)
      .pipe(
        mergeMap((idioma: HttpResponse<IIdioma>) => {
          if (idioma.body) {
            return of(idioma.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default idiomaResolve;

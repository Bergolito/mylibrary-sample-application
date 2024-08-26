import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdioma, NewIdioma } from '../idioma.model';

export type PartialUpdateIdioma = Partial<IIdioma> & Pick<IIdioma, 'id'>;

export type EntityResponseType = HttpResponse<IIdioma>;
export type EntityArrayResponseType = HttpResponse<IIdioma[]>;

@Injectable({ providedIn: 'root' })
export class IdiomaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/idiomas');

  create(idioma: NewIdioma): Observable<EntityResponseType> {
    return this.http.post<IIdioma>(this.resourceUrl, idioma, { observe: 'response' });
  }

  update(idioma: IIdioma): Observable<EntityResponseType> {
    return this.http.put<IIdioma>(`${this.resourceUrl}/${this.getIdiomaIdentifier(idioma)}`, idioma, { observe: 'response' });
  }

  partialUpdate(idioma: PartialUpdateIdioma): Observable<EntityResponseType> {
    return this.http.patch<IIdioma>(`${this.resourceUrl}/${this.getIdiomaIdentifier(idioma)}`, idioma, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIdioma>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIdioma[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getIdiomaIdentifier(idioma: Pick<IIdioma, 'id'>): number {
    return idioma.id;
  }

  compareIdioma(o1: Pick<IIdioma, 'id'> | null, o2: Pick<IIdioma, 'id'> | null): boolean {
    return o1 && o2 ? this.getIdiomaIdentifier(o1) === this.getIdiomaIdentifier(o2) : o1 === o2;
  }

  addIdiomaToCollectionIfMissing<Type extends Pick<IIdioma, 'id'>>(
    idiomaCollection: Type[],
    ...idiomasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const idiomas: Type[] = idiomasToCheck.filter(isPresent);
    if (idiomas.length > 0) {
      const idiomaCollectionIdentifiers = idiomaCollection.map(idiomaItem => this.getIdiomaIdentifier(idiomaItem));
      const idiomasToAdd = idiomas.filter(idiomaItem => {
        const idiomaIdentifier = this.getIdiomaIdentifier(idiomaItem);
        if (idiomaCollectionIdentifiers.includes(idiomaIdentifier)) {
          return false;
        }
        idiomaCollectionIdentifiers.push(idiomaIdentifier);
        return true;
      });
      return [...idiomasToAdd, ...idiomaCollection];
    }
    return idiomaCollection;
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEditora, NewEditora } from '../editora.model';

export type PartialUpdateEditora = Partial<IEditora> & Pick<IEditora, 'id'>;

export type EntityResponseType = HttpResponse<IEditora>;
export type EntityArrayResponseType = HttpResponse<IEditora[]>;

@Injectable({ providedIn: 'root' })
export class EditoraService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/editoras');

  create(editora: NewEditora): Observable<EntityResponseType> {
    return this.http.post<IEditora>(this.resourceUrl, editora, { observe: 'response' });
  }

  update(editora: IEditora): Observable<EntityResponseType> {
    return this.http.put<IEditora>(`${this.resourceUrl}/${this.getEditoraIdentifier(editora)}`, editora, { observe: 'response' });
  }

  partialUpdate(editora: PartialUpdateEditora): Observable<EntityResponseType> {
    return this.http.patch<IEditora>(`${this.resourceUrl}/${this.getEditoraIdentifier(editora)}`, editora, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEditora>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEditora[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEditoraIdentifier(editora: Pick<IEditora, 'id'>): number {
    return editora.id;
  }

  compareEditora(o1: Pick<IEditora, 'id'> | null, o2: Pick<IEditora, 'id'> | null): boolean {
    return o1 && o2 ? this.getEditoraIdentifier(o1) === this.getEditoraIdentifier(o2) : o1 === o2;
  }

  addEditoraToCollectionIfMissing<Type extends Pick<IEditora, 'id'>>(
    editoraCollection: Type[],
    ...editorasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const editoras: Type[] = editorasToCheck.filter(isPresent);
    if (editoras.length > 0) {
      const editoraCollectionIdentifiers = editoraCollection.map(editoraItem => this.getEditoraIdentifier(editoraItem));
      const editorasToAdd = editoras.filter(editoraItem => {
        const editoraIdentifier = this.getEditoraIdentifier(editoraItem);
        if (editoraCollectionIdentifiers.includes(editoraIdentifier)) {
          return false;
        }
        editoraCollectionIdentifiers.push(editoraIdentifier);
        return true;
      });
      return [...editorasToAdd, ...editoraCollection];
    }
    return editoraCollection;
  }
}

import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEditora } from '../editora.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../editora.test-samples';

import { EditoraService } from './editora.service';

const requireRestSample: IEditora = {
  ...sampleWithRequiredData,
};

describe('Editora Service', () => {
  let service: EditoraService;
  let httpMock: HttpTestingController;
  let expectedResult: IEditora | IEditora[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EditoraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Editora', () => {
      const editora = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(editora).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Editora', () => {
      const editora = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(editora).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Editora', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Editora', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Editora', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEditoraToCollectionIfMissing', () => {
      it('should add a Editora to an empty array', () => {
        const editora: IEditora = sampleWithRequiredData;
        expectedResult = service.addEditoraToCollectionIfMissing([], editora);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(editora);
      });

      it('should not add a Editora to an array that contains it', () => {
        const editora: IEditora = sampleWithRequiredData;
        const editoraCollection: IEditora[] = [
          {
            ...editora,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEditoraToCollectionIfMissing(editoraCollection, editora);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Editora to an array that doesn't contain it", () => {
        const editora: IEditora = sampleWithRequiredData;
        const editoraCollection: IEditora[] = [sampleWithPartialData];
        expectedResult = service.addEditoraToCollectionIfMissing(editoraCollection, editora);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(editora);
      });

      it('should add only unique Editora to an array', () => {
        const editoraArray: IEditora[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const editoraCollection: IEditora[] = [sampleWithRequiredData];
        expectedResult = service.addEditoraToCollectionIfMissing(editoraCollection, ...editoraArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const editora: IEditora = sampleWithRequiredData;
        const editora2: IEditora = sampleWithPartialData;
        expectedResult = service.addEditoraToCollectionIfMissing([], editora, editora2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(editora);
        expect(expectedResult).toContain(editora2);
      });

      it('should accept null and undefined values', () => {
        const editora: IEditora = sampleWithRequiredData;
        expectedResult = service.addEditoraToCollectionIfMissing([], null, editora, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(editora);
      });

      it('should return initial array if no Editora is added', () => {
        const editoraCollection: IEditora[] = [sampleWithRequiredData];
        expectedResult = service.addEditoraToCollectionIfMissing(editoraCollection, undefined, null);
        expect(expectedResult).toEqual(editoraCollection);
      });
    });

    describe('compareEditora', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEditora(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEditora(entity1, entity2);
        const compareResult2 = service.compareEditora(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEditora(entity1, entity2);
        const compareResult2 = service.compareEditora(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEditora(entity1, entity2);
        const compareResult2 = service.compareEditora(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IIdioma } from '../idioma.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../idioma.test-samples';

import { IdiomaService } from './idioma.service';

const requireRestSample: IIdioma = {
  ...sampleWithRequiredData,
};

describe('Idioma Service', () => {
  let service: IdiomaService;
  let httpMock: HttpTestingController;
  let expectedResult: IIdioma | IIdioma[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(IdiomaService);
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

    it('should create a Idioma', () => {
      const idioma = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(idioma).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Idioma', () => {
      const idioma = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(idioma).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Idioma', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Idioma', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Idioma', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addIdiomaToCollectionIfMissing', () => {
      it('should add a Idioma to an empty array', () => {
        const idioma: IIdioma = sampleWithRequiredData;
        expectedResult = service.addIdiomaToCollectionIfMissing([], idioma);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(idioma);
      });

      it('should not add a Idioma to an array that contains it', () => {
        const idioma: IIdioma = sampleWithRequiredData;
        const idiomaCollection: IIdioma[] = [
          {
            ...idioma,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addIdiomaToCollectionIfMissing(idiomaCollection, idioma);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Idioma to an array that doesn't contain it", () => {
        const idioma: IIdioma = sampleWithRequiredData;
        const idiomaCollection: IIdioma[] = [sampleWithPartialData];
        expectedResult = service.addIdiomaToCollectionIfMissing(idiomaCollection, idioma);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(idioma);
      });

      it('should add only unique Idioma to an array', () => {
        const idiomaArray: IIdioma[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const idiomaCollection: IIdioma[] = [sampleWithRequiredData];
        expectedResult = service.addIdiomaToCollectionIfMissing(idiomaCollection, ...idiomaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const idioma: IIdioma = sampleWithRequiredData;
        const idioma2: IIdioma = sampleWithPartialData;
        expectedResult = service.addIdiomaToCollectionIfMissing([], idioma, idioma2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(idioma);
        expect(expectedResult).toContain(idioma2);
      });

      it('should accept null and undefined values', () => {
        const idioma: IIdioma = sampleWithRequiredData;
        expectedResult = service.addIdiomaToCollectionIfMissing([], null, idioma, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(idioma);
      });

      it('should return initial array if no Idioma is added', () => {
        const idiomaCollection: IIdioma[] = [sampleWithRequiredData];
        expectedResult = service.addIdiomaToCollectionIfMissing(idiomaCollection, undefined, null);
        expect(expectedResult).toEqual(idiomaCollection);
      });
    });

    describe('compareIdioma', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareIdioma(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareIdioma(entity1, entity2);
        const compareResult2 = service.compareIdioma(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareIdioma(entity1, entity2);
        const compareResult2 = service.compareIdioma(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareIdioma(entity1, entity2);
        const compareResult2 = service.compareIdioma(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

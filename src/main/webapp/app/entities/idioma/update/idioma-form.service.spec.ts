import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../idioma.test-samples';

import { IdiomaFormService } from './idioma-form.service';

describe('Idioma Form Service', () => {
  let service: IdiomaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdiomaFormService);
  });

  describe('Service methods', () => {
    describe('createIdiomaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createIdiomaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
          }),
        );
      });

      it('passing IIdioma should create a new form with FormGroup', () => {
        const formGroup = service.createIdiomaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
          }),
        );
      });
    });

    describe('getIdioma', () => {
      it('should return NewIdioma for default Idioma initial value', () => {
        const formGroup = service.createIdiomaFormGroup(sampleWithNewData);

        const idioma = service.getIdioma(formGroup) as any;

        expect(idioma).toMatchObject(sampleWithNewData);
      });

      it('should return NewIdioma for empty Idioma initial value', () => {
        const formGroup = service.createIdiomaFormGroup();

        const idioma = service.getIdioma(formGroup) as any;

        expect(idioma).toMatchObject({});
      });

      it('should return IIdioma', () => {
        const formGroup = service.createIdiomaFormGroup(sampleWithRequiredData);

        const idioma = service.getIdioma(formGroup) as any;

        expect(idioma).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IIdioma should not enable id FormControl', () => {
        const formGroup = service.createIdiomaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewIdioma should disable id FormControl', () => {
        const formGroup = service.createIdiomaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

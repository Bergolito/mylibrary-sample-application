import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../editora.test-samples';

import { EditoraFormService } from './editora-form.service';

describe('Editora Form Service', () => {
  let service: EditoraFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditoraFormService);
  });

  describe('Service methods', () => {
    describe('createEditoraFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEditoraFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });

      it('passing IEditora should create a new form with FormGroup', () => {
        const formGroup = service.createEditoraFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
          }),
        );
      });
    });

    describe('getEditora', () => {
      it('should return NewEditora for default Editora initial value', () => {
        const formGroup = service.createEditoraFormGroup(sampleWithNewData);

        const editora = service.getEditora(formGroup) as any;

        expect(editora).toMatchObject(sampleWithNewData);
      });

      it('should return NewEditora for empty Editora initial value', () => {
        const formGroup = service.createEditoraFormGroup();

        const editora = service.getEditora(formGroup) as any;

        expect(editora).toMatchObject({});
      });

      it('should return IEditora', () => {
        const formGroup = service.createEditoraFormGroup(sampleWithRequiredData);

        const editora = service.getEditora(formGroup) as any;

        expect(editora).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEditora should not enable id FormControl', () => {
        const formGroup = service.createEditoraFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEditora should disable id FormControl', () => {
        const formGroup = service.createEditoraFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

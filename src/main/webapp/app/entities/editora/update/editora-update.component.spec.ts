import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { EditoraService } from '../service/editora.service';
import { IEditora } from '../editora.model';
import { EditoraFormService } from './editora-form.service';

import { EditoraUpdateComponent } from './editora-update.component';

describe('Editora Management Update Component', () => {
  let comp: EditoraUpdateComponent;
  let fixture: ComponentFixture<EditoraUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let editoraFormService: EditoraFormService;
  let editoraService: EditoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditoraUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EditoraUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EditoraUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    editoraFormService = TestBed.inject(EditoraFormService);
    editoraService = TestBed.inject(EditoraService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const editora: IEditora = { id: 456 };

      activatedRoute.data = of({ editora });
      comp.ngOnInit();

      expect(comp.editora).toEqual(editora);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEditora>>();
      const editora = { id: 123 };
      jest.spyOn(editoraFormService, 'getEditora').mockReturnValue(editora);
      jest.spyOn(editoraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ editora });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: editora }));
      saveSubject.complete();

      // THEN
      expect(editoraFormService.getEditora).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(editoraService.update).toHaveBeenCalledWith(expect.objectContaining(editora));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEditora>>();
      const editora = { id: 123 };
      jest.spyOn(editoraFormService, 'getEditora').mockReturnValue({ id: null });
      jest.spyOn(editoraService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ editora: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: editora }));
      saveSubject.complete();

      // THEN
      expect(editoraFormService.getEditora).toHaveBeenCalled();
      expect(editoraService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEditora>>();
      const editora = { id: 123 };
      jest.spyOn(editoraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ editora });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(editoraService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

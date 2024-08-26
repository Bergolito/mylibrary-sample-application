import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IdiomaService } from '../service/idioma.service';
import { IIdioma } from '../idioma.model';
import { IdiomaFormService } from './idioma-form.service';

import { IdiomaUpdateComponent } from './idioma-update.component';

describe('Idioma Management Update Component', () => {
  let comp: IdiomaUpdateComponent;
  let fixture: ComponentFixture<IdiomaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let idiomaFormService: IdiomaFormService;
  let idiomaService: IdiomaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdiomaUpdateComponent],
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
      .overrideTemplate(IdiomaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IdiomaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    idiomaFormService = TestBed.inject(IdiomaFormService);
    idiomaService = TestBed.inject(IdiomaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const idioma: IIdioma = { id: 456 };

      activatedRoute.data = of({ idioma });
      comp.ngOnInit();

      expect(comp.idioma).toEqual(idioma);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIdioma>>();
      const idioma = { id: 123 };
      jest.spyOn(idiomaFormService, 'getIdioma').mockReturnValue(idioma);
      jest.spyOn(idiomaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ idioma });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: idioma }));
      saveSubject.complete();

      // THEN
      expect(idiomaFormService.getIdioma).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(idiomaService.update).toHaveBeenCalledWith(expect.objectContaining(idioma));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIdioma>>();
      const idioma = { id: 123 };
      jest.spyOn(idiomaFormService, 'getIdioma').mockReturnValue({ id: null });
      jest.spyOn(idiomaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ idioma: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: idioma }));
      saveSubject.complete();

      // THEN
      expect(idiomaFormService.getIdioma).toHaveBeenCalled();
      expect(idiomaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIdioma>>();
      const idioma = { id: 123 };
      jest.spyOn(idiomaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ idioma });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(idiomaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

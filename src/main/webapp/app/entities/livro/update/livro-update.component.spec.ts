import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAutor } from 'app/entities/autor/autor.model';
import { AutorService } from 'app/entities/autor/service/autor.service';
import { IEditora } from 'app/entities/editora/editora.model';
import { EditoraService } from 'app/entities/editora/service/editora.service';
import { IIdioma } from 'app/entities/idioma/idioma.model';
import { IdiomaService } from 'app/entities/idioma/service/idioma.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { ILivro } from '../livro.model';
import { LivroService } from '../service/livro.service';
import { LivroFormService } from './livro-form.service';

import { LivroUpdateComponent } from './livro-update.component';

describe('Livro Management Update Component', () => {
  let comp: LivroUpdateComponent;
  let fixture: ComponentFixture<LivroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let livroFormService: LivroFormService;
  let livroService: LivroService;
  let autorService: AutorService;
  let editoraService: EditoraService;
  let idiomaService: IdiomaService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LivroUpdateComponent],
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
      .overrideTemplate(LivroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    livroFormService = TestBed.inject(LivroFormService);
    livroService = TestBed.inject(LivroService);
    autorService = TestBed.inject(AutorService);
    editoraService = TestBed.inject(EditoraService);
    idiomaService = TestBed.inject(IdiomaService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Autor query and add missing value', () => {
      const livro: ILivro = { id: 456 };
      const autor: IAutor = { id: 23130 };
      livro.autor = autor;

      const autorCollection: IAutor[] = [{ id: 1837 }];
      jest.spyOn(autorService, 'query').mockReturnValue(of(new HttpResponse({ body: autorCollection })));
      const additionalAutors = [autor];
      const expectedCollection: IAutor[] = [...additionalAutors, ...autorCollection];
      jest.spyOn(autorService, 'addAutorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(autorService.query).toHaveBeenCalled();
      expect(autorService.addAutorToCollectionIfMissing).toHaveBeenCalledWith(
        autorCollection,
        ...additionalAutors.map(expect.objectContaining),
      );
      expect(comp.autorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Editora query and add missing value', () => {
      const livro: ILivro = { id: 456 };
      const editora: IEditora = { id: 24791 };
      livro.editora = editora;

      const editoraCollection: IEditora[] = [{ id: 2178 }];
      jest.spyOn(editoraService, 'query').mockReturnValue(of(new HttpResponse({ body: editoraCollection })));
      const additionalEditoras = [editora];
      const expectedCollection: IEditora[] = [...additionalEditoras, ...editoraCollection];
      jest.spyOn(editoraService, 'addEditoraToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(editoraService.query).toHaveBeenCalled();
      expect(editoraService.addEditoraToCollectionIfMissing).toHaveBeenCalledWith(
        editoraCollection,
        ...additionalEditoras.map(expect.objectContaining),
      );
      expect(comp.editorasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Idioma query and add missing value', () => {
      const livro: ILivro = { id: 456 };
      const idioma: IIdioma = { id: 23613 };
      livro.idioma = idioma;

      const idiomaCollection: IIdioma[] = [{ id: 23458 }];
      jest.spyOn(idiomaService, 'query').mockReturnValue(of(new HttpResponse({ body: idiomaCollection })));
      const additionalIdiomas = [idioma];
      const expectedCollection: IIdioma[] = [...additionalIdiomas, ...idiomaCollection];
      jest.spyOn(idiomaService, 'addIdiomaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(idiomaService.query).toHaveBeenCalled();
      expect(idiomaService.addIdiomaToCollectionIfMissing).toHaveBeenCalledWith(
        idiomaCollection,
        ...additionalIdiomas.map(expect.objectContaining),
      );
      expect(comp.idiomasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Usuario query and add missing value', () => {
      const livro: ILivro = { id: 456 };
      const usuarios: IUsuario[] = [{ id: 17949 }];
      livro.usuarios = usuarios;

      const usuarioCollection: IUsuario[] = [{ id: 1043 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [...usuarios];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining),
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const livro: ILivro = { id: 456 };
      const autor: IAutor = { id: 12790 };
      livro.autor = autor;
      const editora: IEditora = { id: 3415 };
      livro.editora = editora;
      const idioma: IIdioma = { id: 24470 };
      livro.idioma = idioma;
      const usuarios: IUsuario = { id: 4849 };
      livro.usuarios = [usuarios];

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(comp.autorsSharedCollection).toContain(autor);
      expect(comp.editorasSharedCollection).toContain(editora);
      expect(comp.idiomasSharedCollection).toContain(idioma);
      expect(comp.usuariosSharedCollection).toContain(usuarios);
      expect(comp.livro).toEqual(livro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 123 };
      jest.spyOn(livroFormService, 'getLivro').mockReturnValue(livro);
      jest.spyOn(livroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livro }));
      saveSubject.complete();

      // THEN
      expect(livroFormService.getLivro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(livroService.update).toHaveBeenCalledWith(expect.objectContaining(livro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 123 };
      jest.spyOn(livroFormService, 'getLivro').mockReturnValue({ id: null });
      jest.spyOn(livroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livro }));
      saveSubject.complete();

      // THEN
      expect(livroFormService.getLivro).toHaveBeenCalled();
      expect(livroService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 123 };
      jest.spyOn(livroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(livroService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAutor', () => {
      it('Should forward to autorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(autorService, 'compareAutor');
        comp.compareAutor(entity, entity2);
        expect(autorService.compareAutor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEditora', () => {
      it('Should forward to editoraService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(editoraService, 'compareEditora');
        comp.compareEditora(entity, entity2);
        expect(editoraService.compareEditora).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareIdioma', () => {
      it('Should forward to idiomaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(idiomaService, 'compareIdioma');
        comp.compareIdioma(entity, entity2);
        expect(idiomaService.compareIdioma).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUsuario', () => {
      it('Should forward to usuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

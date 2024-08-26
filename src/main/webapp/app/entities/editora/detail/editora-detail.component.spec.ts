import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EditoraDetailComponent } from './editora-detail.component';

describe('Editora Management Detail Component', () => {
  let comp: EditoraDetailComponent;
  let fixture: ComponentFixture<EditoraDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditoraDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: EditoraDetailComponent,
              resolve: { editora: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EditoraDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditoraDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load editora on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EditoraDetailComponent);

      // THEN
      expect(instance.editora()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { IdiomaDetailComponent } from './idioma-detail.component';

describe('Idioma Management Detail Component', () => {
  let comp: IdiomaDetailComponent;
  let fixture: ComponentFixture<IdiomaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdiomaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: IdiomaDetailComponent,
              resolve: { idioma: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(IdiomaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdiomaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load idioma on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', IdiomaDetailComponent);

      // THEN
      expect(instance.idioma()).toEqual(expect.objectContaining({ id: 123 }));
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

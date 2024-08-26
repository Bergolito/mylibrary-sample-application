import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { AutorDetailComponent } from './autor-detail.component';

describe('Autor Management Detail Component', () => {
  let comp: AutorDetailComponent;
  let fixture: ComponentFixture<AutorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: AutorDetailComponent,
              resolve: { autor: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(AutorDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load autor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', AutorDetailComponent);

      // THEN
      expect(instance.autor()).toEqual(expect.objectContaining({ id: 123 }));
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

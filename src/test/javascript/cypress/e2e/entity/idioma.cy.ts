import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Idioma e2e test', () => {
  const idiomaPageUrl = '/idioma';
  const idiomaPageUrlPattern = new RegExp('/idioma(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const idiomaSample = {};

  let idioma;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/idiomas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/idiomas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/idiomas/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (idioma) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/idiomas/${idioma.id}`,
      }).then(() => {
        idioma = undefined;
      });
    }
  });

  it('Idiomas menu should load Idiomas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('idioma');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Idioma').should('exist');
    cy.url().should('match', idiomaPageUrlPattern);
  });

  describe('Idioma page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(idiomaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Idioma page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/idioma/new$'));
        cy.getEntityCreateUpdateHeading('Idioma');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', idiomaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/idiomas',
          body: idiomaSample,
        }).then(({ body }) => {
          idioma = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/idiomas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [idioma],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(idiomaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Idioma page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('idioma');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', idiomaPageUrlPattern);
      });

      it('edit button click should load edit Idioma page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Idioma');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', idiomaPageUrlPattern);
      });

      it('edit button click should load edit Idioma page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Idioma');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', idiomaPageUrlPattern);
      });

      it('last delete button click should delete instance of Idioma', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('idioma').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', idiomaPageUrlPattern);

        idioma = undefined;
      });
    });
  });

  describe('new Idioma page', () => {
    beforeEach(() => {
      cy.visit(`${idiomaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Idioma');
    });

    it('should create an instance of Idioma', () => {
      cy.get(`[data-cy="nome"]`).type('optimistic even pfft');
      cy.get(`[data-cy="nome"]`).should('have.value', 'optimistic even pfft');

      cy.get(`[data-cy="descricao"]`).type('poet new');
      cy.get(`[data-cy="descricao"]`).should('have.value', 'poet new');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        idioma = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', idiomaPageUrlPattern);
    });
  });
});

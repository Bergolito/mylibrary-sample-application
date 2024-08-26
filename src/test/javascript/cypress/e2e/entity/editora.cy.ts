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

describe('Editora e2e test', () => {
  const editoraPageUrl = '/editora';
  const editoraPageUrlPattern = new RegExp('/editora(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const editoraSample = {};

  let editora;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/editoras+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/editoras').as('postEntityRequest');
    cy.intercept('DELETE', '/api/editoras/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (editora) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/editoras/${editora.id}`,
      }).then(() => {
        editora = undefined;
      });
    }
  });

  it('Editoras menu should load Editoras page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('editora');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Editora').should('exist');
    cy.url().should('match', editoraPageUrlPattern);
  });

  describe('Editora page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(editoraPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Editora page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/editora/new$'));
        cy.getEntityCreateUpdateHeading('Editora');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', editoraPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/editoras',
          body: editoraSample,
        }).then(({ body }) => {
          editora = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/editoras+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [editora],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(editoraPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Editora page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('editora');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', editoraPageUrlPattern);
      });

      it('edit button click should load edit Editora page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Editora');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', editoraPageUrlPattern);
      });

      it('edit button click should load edit Editora page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Editora');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', editoraPageUrlPattern);
      });

      it('last delete button click should delete instance of Editora', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('editora').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', editoraPageUrlPattern);

        editora = undefined;
      });
    });
  });

  describe('new Editora page', () => {
    beforeEach(() => {
      cy.visit(`${editoraPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Editora');
    });

    it('should create an instance of Editora', () => {
      cy.get(`[data-cy="nome"]`).type('fatally gah');
      cy.get(`[data-cy="nome"]`).should('have.value', 'fatally gah');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        editora = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', editoraPageUrlPattern);
    });
  });
});

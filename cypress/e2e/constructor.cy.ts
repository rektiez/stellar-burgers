const SELECTORS = {
  CONSTRUCTOR: '[class*=constructor]',
  MODALS_BUTTON: '#modals button',
  ORDER_BUTTON: 'button:contains("Оформить заказ")',
} as const;

const INGREDIENTS = {
  BUN: 'Краторная булка N-200i',
  MAIN: 'Биокотлета из марсианской Магнолии',
  SAUCE: 'Соус Spicy-X',
} as const;

const URLS = {
  BASE: 'http://localhost:4000/',
  INGREDIENT: '/ingredients/',
} as const;

const TEXTS = {
  INGREDIENT_DETAILS: 'Детали ингредиента',
  CALORIES: 'Калории, ккал',
  PROTEINS: 'Белки, г',
  EMPTY_BUNS: 'Выберите булки',
  EMPTY_FILLINGS: 'Выберите начинку',
  ORDER_NUMBER: '12345',
} as const;

describe('Constructor page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Adding ingredients', () => {
    it('should add bun to constructor', () => {
      cy.addIngredient(INGREDIENTS.BUN);

      cy.contains(`${INGREDIENTS.BUN} (верх)`).should('exist');
      cy.contains(`${INGREDIENTS.BUN} (низ)`).should('exist');
    });

    it('should add main ingredient to constructor', () => {
      cy.addIngredient(INGREDIENTS.MAIN);

      cy.get(SELECTORS.CONSTRUCTOR).should('contain', INGREDIENTS.MAIN);
    });

    it('should add sauce to constructor', () => {
      cy.addIngredient(INGREDIENTS.SAUCE);

      cy.get(SELECTORS.CONSTRUCTOR).should('contain', INGREDIENTS.SAUCE);
    });
  });

  describe('Modal windows', () => {
    it('should open ingredient modal on click', () => {
      cy.contains(INGREDIENTS.BUN).first().click();
      
      cy.url().should('include', URLS.INGREDIENT);
      
      cy.contains(TEXTS.INGREDIENT_DETAILS).should('be.visible');
      cy.contains(TEXTS.CALORIES).should('be.visible');
      cy.contains('420').should('be.visible');
      cy.contains(TEXTS.PROTEINS).should('be.visible');
      cy.contains('80').should('be.visible');
    });

    it('should close modal on close button click', () => {
      cy.contains(INGREDIENTS.BUN).first().click();
      cy.url().should('include', URLS.INGREDIENT);
      
      cy.contains(TEXTS.INGREDIENT_DETAILS).should('be.visible');
      
      cy.get(SELECTORS.MODALS_BUTTON).first().click();
      
      cy.url().should('eq', URLS.BASE);
      cy.contains(TEXTS.INGREDIENT_DETAILS).should('not.exist');
    });

    it('should close modal on overlay click', () => {
      cy.contains(INGREDIENTS.BUN).first().click();
      cy.url().should('include', URLS.INGREDIENT);
      
      cy.contains(TEXTS.INGREDIENT_DETAILS).should('be.visible');
      
      cy.get('body').click(0, 0);
      
      cy.url().should('eq', URLS.BASE);
      cy.contains(TEXTS.INGREDIENT_DETAILS).should('not.exist');
    });
  });

  describe('Order creation', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
      cy.setCookie('accessToken', 'Bearer test-access-token');
    });

    afterEach(() => {
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
      cy.clearCookie('accessToken');
    });

    it('should create order successfully', () => {
      cy.addIngredient(INGREDIENTS.BUN);
      cy.addIngredient(INGREDIENTS.MAIN);
      cy.addIngredient(INGREDIENTS.SAUCE);

      cy.get(SELECTORS.ORDER_BUTTON).click();
      
      cy.wait('@createOrder');

      cy.contains(TEXTS.ORDER_NUMBER, { timeout: 15000 }).should('be.visible');

      cy.get(SELECTORS.MODALS_BUTTON).first().click();

      cy.contains(TEXTS.EMPTY_BUNS).should('exist');
      cy.contains(TEXTS.EMPTY_FILLINGS).should('exist');
    });
  });
});
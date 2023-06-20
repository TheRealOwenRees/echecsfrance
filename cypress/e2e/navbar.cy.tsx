describe("Mobile Navbar", () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    cy.visit("/");
  });

  it("hamburger menu on mobile screens", () => {
    cy.get("[data-cy='mobile-menu']").should("be.visible");
    cy.get("[data-cy='desktop-menu']").should("be.not.visible");
  });

  it("hamburger button available", () => {
    cy.get("[data-cy='hamburger-button']").should("be.visible");
  });
});

describe("Desktop Navbar", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    cy.visit("/");
  });

  it("desktop menu on larger screens", () => {
    cy.get("[data-cy='mobile-menu']").should("be.hidden");
    cy.get("[data-cy='desktop-menu']").should("be.not.hidden");
  });

  it("hamburger button hidden", () => {
    cy.get("[data-cy='hamburger-button']").should("be.not.visible");
  });
});

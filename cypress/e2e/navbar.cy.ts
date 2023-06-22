describe("Mobile Navbar", () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    cy.visit("/");
  });

  it("hamburger menu on mobile screens", () => {
    cy.getByData("mobile-menu").should("be.visible");
    cy.getByData("desktop-menu").should("be.not.visible");
  });

  it("hamburger button available", () => {
    cy.getByData("hamburger-button").should("be.visible");
  });
});

describe("Desktop Navbar", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    cy.visit("/");
  });

  it("desktop menu on larger screens", () => {
    cy.getByData("mobile-menu").should("be.hidden");
    cy.getByData("desktop-menu").should("be.not.hidden");
  });

  it("hamburger button hidden", () => {
    cy.getByData("hamburger-button").should("be.not.visible");
  });
});

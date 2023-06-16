describe("Mobile Navbar", () => {
  beforeEach(() => {
    cy.viewport(600, 600);
    cy.visit("/");
  });

  it("hamburger menu on mobile screens", () => {
    cy.get(".mobile-menu").should("be.not.hidden");
    cy.get(".desktop-menu").should("be.hidden");
  });

  it("hamburger button available", () => {
    cy.get(".hamburger-button").should("be.visible");
  });
});

describe("Desktop Navbar", () => {
  beforeEach(() => {
    cy.viewport("macbook-15");
    cy.visit("/");
  });

  it("desktop menu on larger screens", () => {
    cy.get(".mobile-menu").should("be.hidden");
    cy.get(".desktop-menu").should("be.not.hidden");
  });

  it("hamburger button hidden", () => {
    cy.get(".hamburger-button").should("be.not.visible");
  });
});

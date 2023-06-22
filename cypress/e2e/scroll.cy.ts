describe("Scroll to top button", () => {
  beforeEach(() => {
    cy.visit("/tournois");
  });

  it("desktop scroll to top", () => {
    cy.viewport(1024, 800);
    cy.get("[data-cy='tournament-table-div']").scrollTo("bottom");
    cy.get("[data-cy='scroll-to-top-button']").click();
    // cy.get("[data-cy='tournament-table-div']")
    //   .invoke("scrollTop")
    //   .should("equal", 0);
    //   cy.get("[data-cy='tournament-table-div']")
    //     .its("scrollY")
    //     .should("not.equal", 0);
    // TODO need to test element scrolls back to 0
  });

  it("mobile scroll to top", () => {
    cy.viewport(600, 600);
    cy.scrollTo("bottom");
    cy.window().its("scrollY").should("not.equal", 0);
    cy.get("[data-cy='scroll-to-top-button']").click();
    cy.window().its("scrollY").should("equal", 0);
  });
});

describe("Test all links", () => {
  // TODO traverse entire site
  it("Test all links on homepage return 200 status", () => {
    cy.visit("/");
    cy.get("a").each((page) => {
      cy.request(page.prop("href"));
    });
  });

  it("Check navbar links point to correct pathname", () => {
    const pages = ["tournois", "about", "contact"];

    cy.visit("/");

    pages.forEach((page) => {
      cy.contains(page, { matchCase: false }).click();
      cy.location("pathname").should("eq", `/${page}`); // url path matches link name
      cy.go("back");
    });
  });
});

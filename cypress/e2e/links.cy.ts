describe("Test all links", () => {
  const pages = ["tournois", "about", "contact"];

  it("Check navbar links point to correct pathname", () => {
    cy.visit("/");
    pages.forEach((page) => {
      cy.contains(page, { matchCase: false }).click();
      cy.location("pathname").should("eq", `/${page}`); // url path matches link name
      cy.go("back");
    });
  });

  it("Check dead links", () => {
    pages.forEach((page) => {
      cy.visit(`/${page}`);
      cy.get("a:not([href*='mailto:']").each((link) => {
        if (
          !link
            .prop("href")
            .includes("http://www.echecs.asso.fr/FicheTournoi.aspx") // ignore every external FFE tournament link
        ) {
          cy.request({
            url: link.prop("href"),
            failOnStatusCode: false,
          });
          cy.log(link.prop("href"));
        }
      });
    });
  });
});

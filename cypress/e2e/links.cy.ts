describe("Test all links", () => {
  const pages = ["tournois", "qui sommes-nous", "contactez-nous"];

  const navLinkToSlug = (navLink: string) => {
    return navLink.replace(/\s+/g, "-");
  };

  it("Check navbar links point to correct pathname as a slug", () => {
    cy.viewport(600, 600);
    cy.visit("/");
    pages.forEach((page) => {
      cy.get(".hamburger-button").click();
      cy.contains(page, { matchCase: false }).click();
      cy.location("pathname").should("eq", `/${navLinkToSlug(page)}`); // url path matches link name, replacing whitespace with hyphens
      cy.go("back");
    });
  });

  it("Check dead links", () => {
    pages.forEach((page) => {
      cy.visit(`/${navLinkToSlug(page)}`);
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

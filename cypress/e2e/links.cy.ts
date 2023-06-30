// noinspection HttpUrlsUsage

describe("Test links", () => {
  const pages = ["tournois", "qui sommes-nous", "contactez-nous"];

  const navLinkToSlug = (navLink: string) => {
    return navLink.replace(/\s+/g, "-");
  };

  const testLinks = () => {
    cy.get("a:not([href*='mailto:']):not(nav a):not(footer a)").each((link) => {
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
  };

  it("navbar links point to correct pathname as a slug", () => {
    cy.viewport(600, 600);
    cy.visit("/");
    pages.forEach((page) => {
      cy.getByData("hamburger-button").click();
      cy.contains(page, { matchCase: false }).click();
      cy.location("pathname").should("eq", `/${navLinkToSlug(page)}`); // url path matches link name, replacing whitespace with hyphens
      cy.go("back");
    });
  });

  // TODO consider doing .each from pages array once links are on each page
  // TODO at present, the commented out tests have no links so fail
  it("homepage dead links", () => {
    cy.visit("/");
    testLinks();
  });

  it("tournois dead links", () => {
    cy.visit("/tournois");
    testLinks();
  });

  // it("qui-sommes-nous dead links", () => {s
  //   cy.visit("/qui-sommes-nous");
  //   testLinks();
  // });
  //
  // it("contactez-nous dead links", () => {
  //   cy.visit("/contactez-nous");
  //   testLinks();
  // });

  //TODO consider 5 random links rather than first 5
  it("first 5 tournament external links", () => {
    cy.visit("/tournois");
    cy.get("a:not([href*='mailto:']):not(nav a):not(footer a)").each(
      (link, index) => {
        if (index < 5) {
          cy.request({
            url: link.prop("href"),
            failOnStatusCode: false,
          });
          cy.log(link.prop("href"));
        }
      }
    );
  });
});

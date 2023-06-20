import Home from "@/app/page";
import About from "@/app/qui-sommes-nous/page";
import Contact from "@/app/contactez-nous/page";

const navbarFooterCheck = () => {
  it("includes navbar", () => {
    cy.get("[data-cy='navbar']");
  });

  it("includes footer", () => {
    cy.get("[data-cy='footer']");
  });
};

describe("Verify component mount", () => {
  describe("Verify home page", () => {
    beforeEach(() => {
      cy.mount(<Home />);
    });

    it("correct h1 tags with website name included", () => {
      cy.get("[data-cy='header1']").contains("echecs france", {
        matchCase: false,
      });
    });

    navbarFooterCheck();
  });

  describe("Verify about page", () => {
    beforeEach(() => {
      cy.mount(<About />);
    });

    it("correct h1 tags with page title included", () => {
      cy.get("[data-cy='header2']").contains("qui sommes-nous", {
        matchCase: false,
      });
    });

    navbarFooterCheck();
  });

  describe("Verify contact page", () => {
    beforeEach(() => {
      cy.mount(<Contact />);
    });

    it("correct h1 tags with page title included", () => {
      cy.get("[data-cy='header2']").contains("contactez-nous", {
        matchCase: false,
      });
    });

    navbarFooterCheck();
  });
});

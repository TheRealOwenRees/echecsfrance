import Home from "@/app/[lang]/page";
import About from "@/app/[lang]/qui-sommes-nous/page";
import Contact from "@/app/[lang]/contactez-nous/page";

const navbarFooterCheck = () => {
  it("includes navbar", () => {
    cy.getByData("navbar");
  });

  it("includes footer", () => {
    cy.getByData("footer");
  });
};

describe("Verify component mount", () => {
  describe("Verify home page", () => {
    beforeEach(() => {
      cy.mount(<Home />);
    });

    it("correct h1 tags with website name included", () => {
      cy.getByData("header1").contains("échecs france", {
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
      cy.getByData("header2").contains("qui sommes-nous", {
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
      cy.getByData("header2").contains("contactez-nous", {
        matchCase: false,
      });
    });

    navbarFooterCheck();
  });
});

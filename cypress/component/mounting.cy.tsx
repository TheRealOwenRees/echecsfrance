import Home from "@/app/page";
import About from "@/app/about/page";
import Contact from "@/app/contact/page";

const navbarFooterCheck = () => {
  it("includes navbar", () => {
    cy.get("nav");
  });

  it("includes footer", () => {
    cy.get("footer");
  });
};

describe("Verify home page", () => {
  beforeEach(() => {
    cy.mount(<Home />);
  });

  it("should have the correct h1 tags with website name included", () => {
    cy.get("h1").contains("echecs france", { matchCase: false });
  });

  navbarFooterCheck();
});

describe("Verify about page", () => {
  beforeEach(() => {
    cy.mount(<About />);
  });

  it("should have the correct h1 tags with page title included", () => {
    cy.get("h1").contains("about", { matchCase: false });
  });

  navbarFooterCheck();
});

describe("Verify contact page", () => {
  beforeEach(() => {
    cy.mount(<Contact />);
  });

  it("should have the correct h1 tags with page title included", () => {
    cy.get("h1").contains("contact", { matchCase: false });
  });

  navbarFooterCheck();
});

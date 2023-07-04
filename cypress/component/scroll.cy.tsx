import ScrollToTopButton from "@/app/[lang]/tournois/ScrollToTopButton";

describe("Scroll to top button", () => {
  it("desktop scroll button clickable", () => {
    cy.viewport("macbook-15");
    cy.mount(<ScrollToTopButton />);
    cy.getByData("scroll-to-top-button").should("exist").click();
  });

  it("mobile scroll button clickable", () => {
    cy.viewport(600, 600);
    cy.mount(<ScrollToTopButton />);
    cy.getByData("scroll-to-top-button").should("exist").click();
  });
});

import React from "react";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import Home from "@/app/page";
import "@/css/theme-toggle.css";

describe("ThemeSwitcher component", () => {
  it("should toggle between light and dark mode", () => {
    cy.mount(<Home />);
    cy.mount(<ThemeSwitcher />);
    cy.wait(100);

    // checking that the toggle is there and light mode is active
    cy.get("[data-cy='toggle']").should("exist");
    cy.get("[data-cy='toggle']").should(($toggle) => {
      const backgroundImage = $toggle.css("background-image");
      expect(backgroundImage).to.include(
        "linear-gradient(rgb(0, 255, 255), rgb(135, 206, 235)"
      );
    });
    // checking that the toggle is clickable and dark mode is active
    cy.get("[data-cy='toggle']").click();
    cy.get("[data-cy='toggle-dark']").should("exist");
    cy.get("[data-cy='toggle-dark']").should(($toggle) => {
      const backgroundImage = $toggle.css("background-image");
      expect(backgroundImage).to.include(
        "linear-gradient(rgb(25, 25, 112), rgb(102, 51, 153)"
      );
    });
  });
});

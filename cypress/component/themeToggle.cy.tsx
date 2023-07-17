import React from "react";
import ThemeSwitcher from "@/app/[lang]/components/ThemeSwitcher";
import "@/css/theme-toggle.css";

describe("ThemeSwitcher component", () => {
  it("should toggle between light and dark mode", () => {
    cy.mount(<ThemeSwitcher />);

    // checking that the toggle is there and light mode is active
    cy.getByData("toggle").should("exist");
    cy.getByData("toggle").should(($toggle) => {
      const backgroundImage = $toggle.css("background-image");
      expect(backgroundImage).to.include(
        "linear-gradient(rgb(0, 255, 255), rgb(135, 206, 235)",
      );
    });

    // checking that the toggle is clickable and dark mode is active
    cy.getByData("toggle").last().click();
    cy.getByData("toggle-dark").should("exist");
    cy.getByData("toggle-dark").should(($toggle) => {
      const backgroundImage = $toggle.css("background-image");
      expect(backgroundImage).to.include(
        "linear-gradient(rgb(25, 25, 112), rgb(102, 51, 153)",
      );
    });
  });
});

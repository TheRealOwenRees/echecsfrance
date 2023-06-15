import React from 'react';
import ThemeSwitcher from "../../components/ThemeSwitcher";
import Home from "@/app/page";
import useDarkMode from '@/hooks/useDarkMode';
import '../../app/globals.css';

describe('ThemeSwitcher component', () => {
  it('should toggle between light and dark mode', () => {
    cy.mount(<Home />);
    cy.mount(<ThemeSwitcher />);
    cy.wait(100);

    // checking that the toggle is there and light mode is active
    cy.get('.toggle').should('exist');
    cy.get('.toggle').should(($toggle) => {
        const backgroundImage = $toggle.css('background-image');
        expect(backgroundImage).to.include('linear-gradient(rgb(0, 255, 255), rgb(135, 206, 235)');
    });
    // checking that the toggle is clickable and dark mode is active
    cy.get('.toggle').click();
    cy.get('.toggle-dark').should('exist');
    cy.get('.toggle-dark').should(($toggle) => {
        const backgroundImage = $toggle.css('background-image');
        expect(backgroundImage).to.include('linear-gradient(rgb(25, 25, 112), rgb(102, 51, 153)');
    });
  });
});
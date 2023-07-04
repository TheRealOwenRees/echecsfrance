// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import { mount } from "cypress/react18";

import TestableLayout from "@/app/[lang]/components/TestableLayout";
import messages from "@/messages/fr.json";
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    // noinspection JSUnusedGlobalSymbols
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", (component, options) => {
  const wrapped = (
    <TestableLayout locale="fr" messages={messages}>
      {component}
    </TestableLayout>
  );

  return mount(wrapped, options);
});

// Example use:
// cy.mount(<MyComponent />)

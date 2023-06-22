describe("Contact form", () => {
  const email = "test@test.com";
  const invalidEmail = "test@";
  const subject = "Test Subject";
  const message = "Test message";

  describe("Invalid data", () => {
    beforeEach(() => {
      cy.visit("/contactez-nous");
    });

    it("invalid email address", () => {
      cy.getByData("email-input").type(invalidEmail);
      cy.getByData("subject-input").type(subject);
      cy.getByData("message-input").type(message);
      cy.getByData("submit-button").click();
      cy.getByData("info-message").should("have.text", "");
    });

    it("missing subject", () => {
      cy.getByData("email-input").type(email);
      cy.getByData("message-input").type(message);
      cy.getByData("submit-button").click();
      cy.getByData("info-message").should("have.text", "");
    });

    it("missing message", () => {
      cy.getByData("email-input").type(email);
      cy.getByData("subject-input").type(subject);
      cy.getByData("submit-button").click();
      cy.getByData("info-message").should("have.text", "");
    });
  });

  describe("Valid data", () => {
    beforeEach(() => {
      cy.visit("/contactez-nous");
    });

    it("valid input", () => {
      cy.getByData("email-input").type(email);
      cy.getByData("subject-input").type(subject);
      cy.getByData("message-input").type(message);
      cy.getByData("submit-button").click().should("be.disabled");
      cy.wait(3000);
      cy.getByData("info-message").contains("Thank you");
      cy.getByData("submit-button").click().should("be.not.disabled");
    });
  });
});

let tableRows: number;
describe("Data fetching for map", () => {
  it("map markers is equal to table rows", () => {
    cy.visit("/tournois");
    cy.getByData("tournament-table")
      .find("tr")
      .then((rows) => {
        tableRows = rows.length - 1;
      });
    cy.get(".leaflet-marker-icon").then((markers) => {
      expect(markers.length).to.eq(tableRows);
    });
  });
});

describe("Data fetching from API endpoints", () => {
  it("api call should equal website data count", () => {
    cy.request("GET", "http://localhost:3000/api/v1/tournaments/france").then(
      (response) => {
        expect(response.status).to.eq(200);
        const responseData = response.body;
        const itemCount = responseData.length;
        expect(itemCount).to.eq(tableRows);
      }
    );
  });
});

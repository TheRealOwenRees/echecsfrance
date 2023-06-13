// import { Tournament } from "@/types";
// import getTournaments from "@/utils/getTournamentData";
// import { createLayerGroups } from "@/utils/layerGroups";
//

// // TODO rewrite this test suite since I no longer use fetch for the map
// // TODO add tests for the API once it is active
// describe("Unit tests of utils directory", () => {
//   describe("Retrieve tournament data from DB", () => {
//     let response: Tournament[];
//     let results: Tournament[];
//
//     describe("France", () => {
//       before(async () => {
//         response = await getTournaments("france");
//         results = response.splice(0, 5);
//       });
//
//       it("log first 5 results", () => {
//         results.forEach((result) => cy.log(JSON.stringify(result)));
//       });
//
//       it("check tournament urls are active", () => {
//         results.forEach((result) => cy.request(result.url));
//       });
//     });
//   });
//
//   describe("Create layer groups for map markers", () => {
//     let response: Tournament[];
//     let results: Tournament[];
//     describe("France", () => {
//       const timeControls = [
//         { name: "Cadence Lente", colour: "green" },
//         { name: "Rapide", colour: "blue" },
//         { name: "Blitz", colour: "yellow" },
//         { name: "1h KO", colour: "red" },
//       ];
//
//       before(async () => {
//         response = await getTournaments("france");
//         results = response.splice(0, 5);
//       });
//
//       it("generate layer groups", () => {
//         const result = timeControls.map((timeControl) => {
//           return createLayerGroups(timeControl.name, timeControl.colour, {
//             tournamentData: results,
//           });
//         });
//         cy.wrap(result.length).should("be.greaterThan", 0);
//       });
//     });
//   });
// });

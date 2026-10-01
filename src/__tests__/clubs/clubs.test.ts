import { describe, expect, test } from "vitest";
import { IClub, filterClubsByManualEntry } from "@/utils/clubFilters";
import { clubData } from "./helpers/clubData";

describe("clubs", () => {
  test("club data is unique", () => {
    const clubDataIds = clubData.map((club) => club._id);
    const originalLength = clubDataIds.length;
    const filteredLength = new Set(clubDataIds).size;
    expect(originalLength).toEqual(filteredLength);
  });

  test("manual entered club filters out auto-generated club of same name", () => {
    const duplicateClubNames: Set<string> = new Set(clubData.map((club) => club.name));

    for (const club of clubData) {
      if (duplicateClubNames.has(club.name)) {
        duplicateClubNames.delete(club.name);
      } else {
        duplicateClubNames.add(club.name);
      }
    }

    const filteredData: IClub[] = filterClubsByManualEntry(clubData);
    expect(filteredData.length).toEqual(clubData.length - duplicateClubNames.size);
  });
});

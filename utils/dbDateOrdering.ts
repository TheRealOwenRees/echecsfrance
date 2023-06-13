import { Db } from "mongodb";

/**
 * Converts date from string into a date to allow ordering
 */
export const dateOrderingFrance = async (db: Db) => {
  return await db
    .collection("tournaments")
    .aggregate([
      {
        $addFields: {
          dateParts: {
            $dateFromString: {
              dateString: "$date",
              format: "%d/%m/%Y",
            },
          },
        },
      },
      {
        $sort: {
          dateParts: 1,
        },
      },
      {
        $unset: "dateParts",
      },
    ])
    .toArray();
};

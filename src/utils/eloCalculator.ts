import { clamp, last } from "lodash";

// Fide uses teh following table to establish the chance of winning based on the difference in elo.
// https://handbook.fide.com/chapter/B022017

const differenceToProbability: [
  start: number,
  end: number,
  winChance: number,
][] = [
  [0, 3, 0.5],
  [4, 10, 0.51],
  [11, 17, 0.52],
  [18, 25, 0.53],
  [26, 32, 0.54],
  [33, 39, 0.55],
  [40, 46, 0.56],
  [47, 53, 0.57],
  [54, 61, 0.58],
  [62, 68, 0.59],
  [69, 76, 0.6],
  [77, 83, 0.61],
  [84, 91, 0.62],
  [92, 98, 0.63],
  [99, 106, 0.64],
  [107, 113, 0.65],
  [114, 121, 0.66],
  [122, 129, 0.67],
  [130, 137, 0.68],
  [138, 145, 0.69],
  [146, 153, 0.7],
  [154, 162, 0.71],
  [163, 170, 0.72],
  [171, 179, 0.73],
  [180, 188, 0.74],
  [189, 197, 0.75],
  [198, 206, 0.76],
  [207, 215, 0.77],
  [216, 225, 0.78],
  [226, 235, 0.79],
  [236, 245, 0.8],
  [246, 256, 0.81],
  [257, 267, 0.82],
  [268, 278, 0.83],
  [279, 290, 0.84],
  [291, 302, 0.85],
  [303, 315, 0.86],
  [316, 328, 0.87],
  [329, 344, 0.88],
  [345, 357, 0.89],
  [358, 374, 0.9],
  [375, 391, 0.91],
  [392, 411, 0.92],
  [412, 432, 0.93],
  [433, 456, 0.94],
  [457, 484, 0.95],
  [485, 517, 0.96],
  [518, 559, 0.97],
  [560, 619, 0.98],
  [620, 735, 0.99],
  [736, 1000, 1],
];

export const getNewRating = (
  rating: number,
  opponentRating: number,
  result: 1 | 0 | 0.5,
  kFactor: number,
) => {
  const differenceInElo = clamp(opponentRating - rating, -400, Infinity);
  const tableRow = (differenceToProbability.find(
    ([start, end]) =>
      Math.abs(differenceInElo) >= start && Math.abs(differenceInElo) <= end,
  ) ?? last(differenceToProbability)!)[2];

  const probabilityOfWinning = differenceInElo < 0 ? tableRow : 1 - tableRow;
  const delta =
    Math.round(
      kFactor * (result - probabilityOfWinning + Number.EPSILON) * 100,
    ) / 100;

  return {
    delta,
    newRating: Math.round((rating + delta + Number.EPSILON) * 100) / 100,
  };
};

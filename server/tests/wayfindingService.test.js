const wayfindingService = require('../services/wayfindingService');
const { Building, ParkingLot } = require('../models');
const Sequelize = require('sequelize');

const testCases = [
  { buildingId: 26, lotId: 49, description: 'CS building & Lot 40' },
  { buildingId: 30, lotId: 52, description: 'Dewey College & Lot 2' },
  { buildingId: 35, lotId: 55, description: 'Earth and Space Sciences & Lot A (Staff)' },
];

describe('Manhattan Distance Calculation', () => {
  testCases.forEach(({ buildingId, lotId, description }) => {

    test(`calculates manhattan distance between ${description}`, async () => {
      // Get building and parking lot by its ID
      const building = await Building.findByPk(buildingId); // Building from testCases
      const lot = await ParkingLot.findByPk(lotId); // Lot from testCases

      // Defensive check
      expect(building).not.toBeNull();
      expect(lot).not.toBeNull();

      const buildingCoords = building.mercator_coordinates.coordinates;
      const lotCoords = lot.mercator_coordinates.coordinates;

      // Defensive check
      expect(buildingCoords).toBeDefined();
      expect(lotCoords).toBeDefined();

      // Unwrap the first point from the MULTIPOINT
      const buildingCoord = buildingCoords[0];
      const lotCoord = lotCoords[0];

      // Devensive check
      expect(buildingCoord.length).toBeGreaterThanOrEqual(2);
      expect(lotCoord.length).toBeGreaterThanOrEqual(2);

      // expectedDistance is the sum of the absolute differences in x and y coordinates
      const expectedDistance = Math.abs(lotCoord[1] - buildingCoord[1]) + Math.abs(lotCoord[0] - buildingCoord[0]);
      // actualDistance calculates the Manhattan distance using the service
      const actualDistance = wayfindingService.manhattanDistance(buildingCoord, lotCoord);

      expect(actualDistance).toBeCloseTo(expectedDistance, 6); // use toBeCloseTo for floating point precision
    });
  });

  test('returns 0 distance for identical coordinates', () => {
    const coord = [100, 200];
    expect(wayfindingService.manhattanDistance(coord, coord)).toBe(0);
  });

  test('returns Infinity for invalid coordinates', () => {
    expect(wayfindingService.manhattanDistance([], [1, 2])).toBe(Infinity);
  });

});
const wayfindingService = require('../services/wayfindingService');
const { Building, ParkingLot, sequelize } = require('../models');

const testCases = [
  { buildingId: 26, lotId: 49, description: 'Computer Science, New & Lot 40' },
  { buildingId: 30, lotId: 52, description: 'Dewey College & Lot 2' },
  { buildingId: 35, lotId: 55, description: 'Earth and Space Sciences & Lot A (Staff)' },
];

describe('manhattanDistance Testing', () => {
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

describe('getSortedLots testing', () => {
  test('returns sorted lots for a building', async () => {
    const lots = await wayfindingService.getSortedParkingLots(26); // Computer Science, New
    expect(Array.isArray(lots)).toBe(true);
    expect(lots.length).toBeGreaterThan(0);

    // Check that the distances are sorted ascending
    for (let i = 0; i < lots.length - 1; i++) {
      expect(lots[i].distance_meters).toBeLessThanOrEqual(lots[i + 1].distance_meters);
    }
  });

  test('throws error for invalid building ID', async () => {
    await expect(wayfindingService.getSortedParkingLots(-1)).rejects.toThrow('Building not found');
  });

});

describe('metersToMiles Testing', () => {
  test('converts 0 meters to 0 miles', () => {
      expect(wayfindingService.metersToMiles(0)).toBe(0);
  });

  test('converts 1609.344 meters to approximately 1 mile', () => {
      const result = wayfindingService.metersToMiles(1609.344);
      expect(result).toBeCloseTo(1, 5); // allow for floating point precision
  });

  test('converts 10000 meters to miles', () => {
      const result = wayfindingService.metersToMiles(10000);
      expect(result).toBeCloseTo(6.21371, 5);
  });

  test('handles negative numbers', () => {
      const result = wayfindingService.metersToMiles(-500);
      expect(result).toBeCloseTo(-0.3106855, 5);
  });

  test('returns 0 for non-numeric or undefined input', () => {
      expect(wayfindingService.metersToMiles(undefined)).toBeNaN();
      expect(wayfindingService.metersToMiles(null)).toBe(0); // null * number is 0
      expect(wayfindingService.metersToMiles('abc')).toBeNaN();
  });

});

// Close the database connection after all tests
afterAll(async () => {
  await sequelize.close();
});
const { Building, ParkingLot } = require('../models');
const wayfindingService = require('../services/wayfindingService');

jest.mock('../models');

describe('getSortedParkingLots_1', () => {
  test('should verify Communications Gated Lot is closest to Javits', async () => {
    const javitsCoordinates = [[-8139912.9355804315, 4999510.882685972]]; 

    Building.findByPk.mockResolvedValue({
      id: 'JAVITS_ID',
      mercator_coordinates: {
        coordinates: javitsCoordinates
      }
    });

    // Mock multiple parking lots, including "Communications Gated Lot"
    ParkingLot.findAll.mockResolvedValue([
      {
        id: 100,
        name: 'Communications Gated Lot',
        mercator_coordinates: {
          coordinates: [[-8140013.00907312, 4999584.074812209]]
        }
      },
      {
        id: 200,
        name: 'Lot 13 (Old H)',
        mercator_coordinates: {
          coordinates: [[-8140526.414564587, 4999709.875383895]]
        }
      },
      {
        id: 300,
        name: 'Lot 35 (Putnam)',
        mercator_coordinates: {
          coordinates: [[-8139649.884894202, 4998529.859181271]]
        }
      }
    ]);

    // Call the function with the Javits building ID
    const sortedLots = await wayfindingService.getSortedParkingLots('JAVITS_ID');

    // Expect that "Communications Gated Lot" is first in the sorted list
    expect(sortedLots[0].name).toBe('Communications Gated Lot');

  });
});

describe('getSortedParkingLots_2', () => {
  test('should verify Lot 20 is closest to Mount College', async () => {
    const mountCoordinates = [[-8140176.788261131, 4999310.2369690845]]; 

    Building.findByPk.mockResolvedValue({
      id: 'MOUNT_ID',
      mercator_coordinates: {
        coordinates: mountCoordinates
      }
    });

    ParkingLot.findAll.mockResolvedValue([
      {
        id: 1,
        name: 'Communications Gated Lot',
        mercator_coordinates: {
          coordinates: [[-8140013.00907312, 4999584.074812209]]
        }
      },
      {
        id: 2,
        name: 'Lot 20 (Cardozo Metered)',
        mercator_coordinates: {
          coordinates: [[-8140311.3453084035, 4999265.308742325]]
        }
      },
      {
        id: 3,
        name: 'Lot 35 (Putnam)',
        mercator_coordinates: {
          coordinates: [[-8139649.884894202, 4998529.859181271]]
        }
      }
    ]);

    const sortedLots = await wayfindingService.getSortedParkingLots('MOUNT_ID');

    expect(sortedLots[0].name).toBe('Lot 20 (Cardozo Metered)');

  });
});


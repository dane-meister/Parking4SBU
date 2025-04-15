const request = require("supertest");
const app = require("../server");
const db = require("../models");
const { Sequelize } = db;

// Increase timeout to prevent premature test failure
jest.setTimeout(15000);

describe("Reservation Concurrency", () => {
  let parkingLot, user1, user2, vehicle1, vehicle2;

  beforeAll(async () => {
    // Sync DB for clean test
    await db.sequelize.sync({ force: true });

    // Create test parking lot with only 1 commuter_core spot
    parkingLot = await db.ParkingLot.create({
      name: "Test Lot",
      location: Sequelize.fn(
        "ST_GeomFromText",
        "MULTIPOINT((-73.0 40.0))",
        4326
      ),
      mercator_coordinates: Sequelize.fn(
        "ST_GeomFromText",
        "MULTIPOINT((-8130000 4999000))",
        3857
      ),
      commuter_core_capacity: 1,
      covered: false
    });

    // Create 2 users and 2 vehicles
    user1 = await db.User.create({
      email: "user1@example.com",
      password: "123",
      first_name: "John",
      last_name: "Doe",
      phone_number: "555-1111",
      user_type: "commuter",
      permit_type: "core",
      driver_license_number: "A1234567",
      dl_state: "NY",
      address_line: "123 Example St",
      city: "Stony Brook",
      state_region: "NY",
      postal_zip_code: "11790",
      country: "USA"
    });

    user2 = await db.User.create({
      email: "user2@example.com",
      password: "123",
      first_name: "Jane",
      last_name: "Smith",
      phone_number: "555-2222",
      user_type: "commuter",
      permit_type: "core",
      driver_license_number: "B9876543",
      dl_state: "NY",
      address_line: "456 Sample Ave",
      city: "Stony Brook",
      state_region: "NY",
      postal_zip_code: "11790",
      country: "USA"
    });

    vehicle1 = await db.Vehicle.create({
      user_id: user1.user_id,
      plate: "ABC123",
      make: "Toyota",
      model: "Corolla",
      year: "2020",
      color: "Blue"
    });

    vehicle2 = await db.Vehicle.create({
      user_id: user2.user_id,
      plate: "XYZ789",
      make: "Honda",
      model: "Civic",
      year: "2021",
      color: "Red"
    });
  });

  test("only one of two simultaneous reservation requests should succeed", async () => {
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour

    const reservationPayload = (user, vehicle) => ({
      user_id: user.user_id,
      parking_lot_id: parkingLot.id,
      vehicle_id: vehicle.vehicle_id,
      start_time: now.toISOString(),
      end_time: later.toISOString(),
      total_price: 5.0,
      spot_count: 1,
      spot_type: "commuter_core"
    });

    const [res1, res2] = await Promise.allSettled([
      request(app).post("/api/reservations").send(reservationPayload(user1, vehicle1)),
      request(app).post("/api/reservations").send(reservationPayload(user2, vehicle2))
    ]);

    const results = [res1, res2];

    // Logging to help debug failures
    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        console.log(`Response ${i + 1}:`, r.value.statusCode, r.value.body);
      } else {
        console.error(`Request ${i + 1} failed:`, r.reason);
      }
    });

    const success = results.filter(r => r.status === "fulfilled" && r.value.statusCode === 201);
    const conflict = results.filter(r => r.status === "fulfilled" && r.value.statusCode === 409);

    expect(success.length).toBe(1);
    expect(conflict.length).toBe(1);
    expect(results.every(r => r.status === "fulfilled")).toBe(true);
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});

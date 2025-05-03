const { User, Feedback, Reservation, ParkingLot } = require("../models");
const adminHandler = require("../routes/admin");

// Mock all Sequelize models so no real database is used
jest.mock("../models");

// Helper to create a mock Express response object with chained .status().json() methods
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper function to exxtract the correct route handler from the Express router stack
// Bypasses the full HTTP server to directly test controller logic
const findHandler = (path, method) => {
  const layer = adminHandler.stack.find(
    l => l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[layer.route.stack.length - 1].handle;
};

describe("Admin Routes", () => {
  let req, res;

  // Reset req and res to default mock objects and clear any mock call counts
  beforeEach(() => {
    req = {
      user: { user_type: 'admin' }, // Simulate req.user to bypass admin middleware
      params: {},
      body: {}
    };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test('GET /users should return all users', async () => {
    // Mock response for User.findAll
    User.findAll.mockResolvedValue([{ id: 1, email: "test@example.com" }]);

    const handler = findHandler("/users", "get");
    await handler(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ email: "test@example.com" })
    ]));
  });

  test('PUT /users/:user_id/approve should approve user', async () => {
    req.params.user_id = 3;

    // Mock user object with save method
    const mockUser = { isApproved: false, save: jest.fn() };
    User.findByPk = jest.fn().mockResolvedValue(mockUser);

    const handler = findHandler("/users/:user_id/approve", "put");
    await handler(req, res);

    expect(mockUser.isApproved).toBe(true);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User approved successfully" })
    );
  });

  test('DELETE /user/:user_id/remove should delete user', async () => {
    req.params.user_id = 4;
    User.destroy.mockResolvedValue(1); // Simulate successful deletion

    const handler = findHandler("/user/:user_id/remove", "delete");
    await handler(req, res);

    expect(User.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "User deleted successfully" })
    );
  });

  test('GET /feedback should return feedback list', async () => {
    // Return one feedback record
    Feedback.findAll.mockResolvedValue([
      { id: 1, comment: "Good job", User: { first_name: "John" } }
    ]);

    const handler = findHandler("/feedback", "get");
    await handler(req, res);

    expect(Feedback.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ comment: "Good job" })
      ])
    );
  });

  test('PUT /feedback/:feedback_id/respond should save admin response', async () => {
    req.params.feedback_id = 1;
    req.body.response_text = 'Thank you for your feedback!';

    // Mock feedback object with save method
    const mockFeedback = { admin_response: null, save: jest.fn() };
    Feedback.findByPk.mockResolvedValue(mockFeedback);

    const handler = findHandler("/feedback/:feedback_id/respond", "put");
    await handler(req, res);

    expect(mockFeedback.admin_response).toBe('Thank you for your feedback!');
    expect(mockFeedback.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Response saved",
        feedback: expect.objectContaining({ admin_response: 'Thank you for your feedback!' })
      })
    );
  });

  test('PUT /event-reservations/:id/approve should approve reservation', async () => {
    req.params.id = 2;
    const mockReservation = { spot_count: 2, status: 'pending', save: jest.fn() };
    Reservation.findByPk.mockResolvedValue(mockReservation);

    const handler = findHandler("/event-reservations/:id/approve", "put");
    await handler(req, res);

    expect(mockReservation.status).toBe('confirmed');
    expect(mockReservation.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Reservation approved" })
    );
  });

  test('PUT /event-reservations/:id/reject should reject reservation', async () => {
    req.params.id = 2;
    const mockReservation = { spot_count: 2, status: 'pending', save: jest.fn() };
    Reservation.findByPk.mockResolvedValue(mockReservation);

    const handler = findHandler("/event-reservations/:id/reject", "put");
    await handler(req, res);

    expect(mockReservation.status).toBe('cancelled');
    expect(mockReservation.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Reservation rejected" })
    );
  });

  test('DELETE /parking-lots/:id/remove should delete parking lot', async () => {
    req.params.id = 5;

    // Mock lot object with a destroy method
    const mockLot = { destroy: jest.fn() };
    ParkingLot.findByPk.mockResolvedValue(mockLot);

    const handler = findHandler("/parking-lots/:id/remove", "delete");
    await handler(req, res);

    expect(mockLot.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test('GET /analytics/capacity-analysis should return capacity data', async () => {
    // Mock one parking lot
    ParkingLot.findAll.mockResolvedValue([
      { id: 1, name: "Lot A", capacity: 100 }
    ]);

    // No reservations made
    Reservation.findAll.mockResolvedValue([]);

    const handler = findHandler("/analytics/capacity-analysis", "get");
    await handler(req, res);

    expect(ParkingLot.findAll).toHaveBeenCalled();
    expect(Reservation.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

});

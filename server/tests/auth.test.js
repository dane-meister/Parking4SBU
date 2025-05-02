const { User } = require("../models");
const bcrypt = require("bcrypt");
const authHandler = require("../routes/auth");

// Mock all Sequelize models and bcrypt so no real database is used 
jest.mock("../models");
jest.mock("bcrypt");

// Helper to create a mock Express response object with chained .status().json() methods
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("POST /register test", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset req and res before each test
    req = { body: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("Missing required fields", async () => {
    req.body = { email: "test@example.com" }; // Only email provided

    // Find the Express route handler for /register
    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/register");
    // Call the controller directly with req and res
    await routeLayer.route.stack[0].handle(req, res);

    // Should respond with 400 status and error message
    expect(res.status).toHaveBeenCalledWith(400); // Bad request
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/missing required fields/i)
    }));
  });

  test('Successful registration', async () => {
    // Provide all required fields
    req.body = {
      email: 'testcase@email.com',
      password: 'veryStrongPa$$w0rd',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '5551234567',
      user_type: 'commuter',
      permit_type: 'core',
      driver_license_number: '111555777',
      dl_state: 'NY',
      address_line: '123 Main St',
      city: 'Stony Brook',
      state_region: 'NY',
      postal_zip_code: '11790',
      country: 'USA'
    };

    // Simulate no user existing with this email already
    User.findOne.mockResolvedValue(null);

    // Simulate bcrypt hashing the password
    bcrypt.hash.mockResolvedValue('hashedpassword');

    // Simulate the user being created successfully
    User.create.mockResolvedValue({
      toJSON: () => ({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name
      })
    });

    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/register");
    // Call /register controller directly
    await routeLayer.route.stack[0].handle(req, res);

    // Should respond with 201 status and success message
    expect(res.status).toHaveBeenCalledWith(201); // Created
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "User registered successfully"
    }));
  });
});

describe("POST /login test", () => {
  let req;
  let res;
  let authHandler;
  let routeLayer;

  beforeAll(() => {
    // Reimport the authHandler to access the router stack
    authHandler = require("../routes/auth");
    // Grab the route layer for /login
    routeLayer = authHandler.stack.find(layer => layer.route.path === "/login");
  });

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("Invalid password", async () => {
    // Mock a hashed password
    const hashed = await bcrypt.hash("correctpassword", 10);

    // User tries the wrong password
    req.body = { email: "test@example.com", password: "wrongpass" };
    // Simulate finding the user with the hashed password
    User.findOne.mockResolvedValue({ password: hashed });

    // Call the /login route handler directly
    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Bad request
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/invalid credentials/i)
    }));
  });

  test("No such user", async () => {
    req.body = { email: "notfound@example.com", password: "password" };
    // Simulate user not found
    User.findOne.mockResolvedValue(null);

    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Bad request
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/invalid credentials/i)
    }));
  });
});

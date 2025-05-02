const { User } = require("../models");
const bcrypt = require("bcrypt");
const authHandler = require("../routes/auth");

jest.mock("../models");
jest.mock("bcrypt");

// Mock Express req/res
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
    req = { body: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("Missing required fields", async () => {
    req.body = { email: "test@example.com" }; // Only email provided

    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/register");
    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Bad request
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/missing required fields/i)
    }));
  });

  test('Successful registration', async () => {
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

    User.findOne.mockResolvedValue(null); // Mock no user found

    bcrypt.hash.mockResolvedValue('hashedpassword'); // Mock the hash function

    User.create.mockResolvedValue({ // Mock the created user
      toJSON: () => ({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name
      })
    });

    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/register");
    await routeLayer.route.stack[0].handle(req, res);

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
    authHandler = require("../routes/auth");
    routeLayer = authHandler.stack.find(layer => layer.route.path === "/login");
  });

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("Invalid password", async () => {
    const hashed = await bcrypt.hash("correctpassword", 10);

    req.body = { email: "test@example.com", password: "wrongpass" };
    User.findOne.mockResolvedValue({ password: hashed });

    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Bad request
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/invalid credentials/i)
    }));
  });

  test("No such user", async () => {
    req.body = { email: "notfound@example.com", password: "password" };
    User.findOne.mockResolvedValue(null);

    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400); // Bad request
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/invalid credentials/i)
    }));
  });
});

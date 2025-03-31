const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models");

// Mock Express req/res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Routes (mocked)", () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = mockResponse();
    jest.clearAllMocks();
  });

  test("Register - missing required fields", async () => {
    const authHandler = require("../routes/auth");
    req.body = { email: "test@example.com" }; // Missing many fields

    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/register");
    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/missing required fields/i)
    }));
  });

  test("Login - invalid password", async () => {
    const authHandler = require("../routes/auth");
    const hashed = await bcrypt.hash("correctpassword", 10);

    req.body = { email: "test@example.com", password: "wrongpass" };
    User.findOne.mockResolvedValue({ password: hashed });

    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/login");
    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/invalid credentials/i)
    }));
  });

  test("Login - no such user", async () => {
    const authHandler = require("../routes/auth");
    req.body = { email: "notfound@example.com", password: "password" };
    User.findOne.mockResolvedValue(null);

    const routeLayer = authHandler.stack.find(layer => layer.route.path === "/login");
    await routeLayer.route.stack[0].handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringMatching(/invalid credentials/i)
    }));
  });
});

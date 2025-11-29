import request from "supertest";
import {
  describe,
  it,
  beforeEach,
  afterAll,
  expect,
  afterEach,
  beforeAll,
} from "vitest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { Dog } from "../src/models/Dog.js";
beforeEach(async () => {
  await User.deleteMany({});
  await Dog.deleteMany({});
});
afterEach(async () => {
  await User.deleteMany({});
  await Dog.deleteMany({});
});

describe("Authentication routes", () => {
  it("signup", async () => {
    const response = await request(app).post("/signup").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
  });

  it("login", async () => {
    await request(app).post("/signup").send({
      username: "testuser",
      password: "testpassword",
    });

    const response = await request(app).post("/login").send({
      username: "testuser",
      password: "testpassword",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
  });
});

describe("Dog routes", () => {
  let agent;

  beforeAll(() => {
    agent = request.agent(app);
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Dog.deleteMany({});

    await agent
      .post("/signup")
      .send({ username: "dogowner", password: "dogpassword" });
    await agent
      .post("/login")
      .send({ username: "dogowner", password: "dogpassword" });
  });

  it("create dog", async () => {
    const response = await agent.post("/api/register").send({
      name: "Kate",
      description: "The best dog ever",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("dogId"); // controller returns { dogId: ... }
  });

  it("get dogs", async () => {
    await agent.post("/api/register").send({
      name: "Kate",
      description: "The best dog ever",
    });

    const response = await agent.get("/api/dogs");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
  });

  it("adopt dog", async () => {
    const registerResponse = await agent.post("/api/register").send({
      name: "Kate",
      description: "The best dog ever",
    });
    const dogId = registerResponse.body.dogId;

    // Logout dogowner and signup/login adopter
    await agent.post("/logout");
    await agent
      .post("/signup")
      .send({ username: "adopter", password: "adopterpassword" });
    await agent
      .post("/login")
      .send({ username: "adopter", password: "adopterpassword" });

    const adoptResponse = await agent.post("/api/adopt").send({
      dogId,
      message: "I would love to adopt Kate!",
    });
    expect(adoptResponse.status).toBe(200);
    expect(adoptResponse.body).toHaveProperty(
      "message",
      "Dog adopted successfully"
    );
  });

  it("remove dog", async () => {
    const registerResponse = await agent.post("/api/register").send({
      name: "Kate",
      description: "The best dog ever",
    });
    const dogId = registerResponse.body.dogId;
  });
});

/*
 ✓ tests/route.test.js (6 tests) 6047ms
   ✓ Authentication routes (2)
     ✓ signup  1712ms
     ✓ login  579ms
   ✓ Dog routes (4)
     ✓ create dog  771ms
     ✓ get dogs  836ms
     ✓ adopt dog  1376ms
     ✓ remove dog  769ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  13:48:59
   Duration  6.54s
*/
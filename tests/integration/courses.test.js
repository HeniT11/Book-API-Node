const request = require("supertest");
const { Course, courseSchema } = require("../../models/course");
const { User } = require("../../models/user");

let server;

describe("/api/courses", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await server.close();
    await Course.remove({});
  });
  describe("GET /", () => {
    it("should return all courses", async () => {
      await Course.collection.insertMany([
        { name: "course1" },
        { name: "course2" },
      ]);
      const res = await request(server).get("/api/courses");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === "course1")).toBeTruthy();
      expect(res.body.some((c) => c.name === "course2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return a course if valid id is passed", async () => {
      const course = new Course({ name: "course1" });
      await course.save();
      const res = await request(server).get("/api/courses/" + course._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", course.name);
    });
    it("should return a 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/courses/1");
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/courses")
        .send({ name: "1234" });
      expect(res.status).toBe(401);
    });
    it("should return 400 if course is less than 3 characters", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/courses")
        .set("x-auth-token", token)
        .send({ name: "12" });
      expect(res.status).toBe(400);
    });
  });
});

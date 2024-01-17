import supertest from "supertest";
import App from "../app";
import prisma from "../prisma";

const app = new App().app;

describe("TEST AUTH", () => {
  beforeEach(() => {
    // menyimpan program yang ingin dijalankan terlebih dahulu sebelum running test
  });
  beforeAll(async () => {
    // menyimpan program yang sekali dijalankan sebelum semua test dijalankan
    await prisma.$connect();
  });

  afterEach(() => {});

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /auth/regis", async () => {
    const regisResult = await supertest(app).post("/auth/regis").send({
      username: "",
      email: "",
      password: "",
    });

    expect(regisResult.status).toBe(201);
    expect(regisResult.body.success).toBeTruthy();
  });
});

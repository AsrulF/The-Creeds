/**
* @jest-environment node
*/


import { matchers } from "jest-json-schema";
import { GET, POST } from "./route";
import { db } from "/src/lib/db";
import jwt from "jsonwebtoken";
expect.extend(matchers);


jest.mock("@/lib/db", () => ({
 db: {
   user: {
     findFirst: jest.fn(),
   },
   category: {
     create: jest.fn(),
   },
 },
}));


jest.mock("jsonwebtoken", () => {
 const originalModule = jest.requireActual("jsonwebtoken");


 return {
   ...originalModule,
   verify: jest.fn(),
 };
});


describe("Route Categories", () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });


 describe("POST", () => {
   it("should return status 401 ", async () => {
     const requestWithoutToken = {
       headers: {
         get: jest.fn().mockReturnValue(null),
       },
     };
     const response = await POST(requestWithoutToken);


     expect(response.status).toBe(401);
     expect(await response.text()).toBe("Token not provided");
   });


   it("should return status 404 when user not found", async () => {
     jwt.verify.mockReturnValue({ userId: 1 }); // Mock user ID
     const request = {
       headers: {
         get: jest.fn().mockReturnValue("mock-token"),
       },
       json: jest.fn(),
     };


     db.user.findFirst.mockResolvedValue(null);


     const response = await POST(request);


     expect(response.status).toBe(404);
     expect(await response.text()).toBe("User not found");
   });


   it("should return status 401 when user not admin", async () => {
     jwt.verify.mockReturnValue({ userId: 1 });
     const request = {
       headers: {
         get: jest.fn().mockReturnValue("mock-token"),
       },
       json: jest.fn(),
     };


     db.user.findFirst.mockResolvedValue({
       id: 1,
       name: "Not Admin",
       role: "USER",
     });


     const response = await POST(request);


     expect(response.status).toBe(401);
     expect(await response.text()).toBe("This account is not ADMIN");
   });


   it("should return status 201 when category created", async () => {
     jwt.verify.mockReturnValue({ userId: 1 });
     const request = {
       headers: {
         get: jest.fn().mockReturnValue("mock-token"),
       },
       json: jest.fn().mockReturnValue({
         name: "Category 1",
       }),
     };


     db.user.findFirst.mockResolvedValue({
       id: "1",
       name: "Admin",
       role: "ADMIN",
     });


     db.category.create.mockResolvedValue({
       id: "1",
       name: "Category 1",
       created_at: new Date().toISOString(),
     });


     const response = await POST(request);
     const body = await response.json();


     const schema = {
       type: "object",
       properties: {
         data: {
           type: "object",
           properties: {
             id: { type: "string" },
             name: { type: "string" },
             created_at: { type: "string", format: "date-time" },
           },
           required: ["id", "name", "created_at"],
         },
       },
     };


     expect(response.status).toBe(201);
     expect(body).toMatchSchema(schema);
   });
 });
});
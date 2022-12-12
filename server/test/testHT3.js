const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require("../server.js");
let chai = require('chai');
let expect = chai.expect;
const localGuide = require('./mocks/localGuideToken.js');
const Type = require('../constants/UserType.js');
const { randomBytes } = require('node:crypto');


let mongoServer;

before(async () => {
    // if readyState is 0, mongoose is not connected
    if (mongoose.connection.readyState === 0) {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    }
});

after(async () => {
    await mongoose.disconnect();
    if (mongoServer !== undefined)
        await mongoServer.stop();
    app.close();
});

describe('Test API for visitor to register', () => {
    it('test visitor registration', async () => {
        const response = await request(app).post("/user/register")
            .send({
                firstName: "FirstNameTest",
                lastName: "LastNameTest",
                email: "s2g172022@gmail.com",
                password: "password",
                role: Type.hiker
            });
        expect(response.statusCode).to.equal(201);
    });

    it('test visitor registration with unvalid first name', async () => {
        const response = await request(app).post("/user/register")
            .send({
                firstName: "",
                lastName: "LastNameTest",
                email: "s2g172022@gmail.com",
                password: "password",
                role: Type.localGuide
            });
        expect(response.statusCode).to.equal(400); // Error code to be defined
    });

    it('test visitor registration with unvalid last name', async () => {
        const response = await request(app).post("/user/register")
            .send({
                firstName: "FirstNameTest",
                lastName: "",
                email: "s2g172022@gmail.com",
                password: "password",
                role: Type.platformManager
            });
        expect(response.statusCode).to.equal(400); // Error code to be defined
    });

    it('test visitor registration with unvalid email', async () => {
        const response = await request(app).post("/user/register")
            .send({
                firstName: "FirstNameTest",
                lastName: "LastNameTest",
                email: "",
                password: "password",
                role: Type.hutWorker
            });
        expect(response.statusCode).to.equal(400); // Error code to be defined
    });

    it('test validation email API',async ()=>{
        const response = await request(app).post("/user/validateEmail").send()
        expect(response.statusCode).to.equal(400);
    })

    it('test wrong login',async ()=>{
        const randomArray = randomBytes(1);
        const response = await request(app).post("/user/login").send({
            "email":"wrong@email.com",
            "password":randomArray[0].toString()
        })
        expect(response.statusCode).to.equal(404);
    })

    it('test verifyuser token API',async ()=>{
        const token = localGuide.token;

        const response = await request(app)
        .get("/example/protected")
        .set('Authorization', "Bearer " + token)
        .send()
        expect(response.statusCode).to.equal(201);
    })

    it('test user API',async ()=>{
        const token = localGuide.token;

        const response = await request(app)
        .get("/user")
        .set('Authorization', "Bearer " + token)
        .send()
        expect(response.statusCode).to.equal(200);
    })
});
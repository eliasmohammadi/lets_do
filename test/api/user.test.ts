import {ServerRunner} from '../../src/app'
import supertest, {SuperAgentTest} from 'supertest'

import {PrismaClient} from '@prisma/client'


describe("User Api", () => {

    const serverRunner = new ServerRunner()
    let request: SuperAgentTest
    beforeAll(() => {
        request = supertest.agent(serverRunner.connect())
    })

    afterAll((done) => {
        new PrismaClient().user.deleteMany({}).then(res => {})
        serverRunner.disconnect()
        done()
    })

    it("should return 400 for invalid email", async () => {
        const response = await request.post('/api/user')
            .set("Accept", "application/json")
            .send({
                email: "bad-email",
                password: "12345"
            })

        expect(response.body).toEqual({error: "email is invalid"})
        expect(response.statusCode).toEqual(400)

    })

    it("should return 400 for empty request", async () => {
        const response = await request.post('/api/user')
            .set("Accept", "application/json")
            .send({})

        expect(response.body).toEqual({error: "missing fields: email,password"})
        expect(response.statusCode).toEqual(400)
    })

    it("should return 409 for duplicated email", async () => {
        await request
            .post('/api/user')
            .send({email: "e@gmail.com", password: "12345"})

        const response = await request
            .post('/api/user')
            .send({email: "e@gmail.com", password: "12345"})

        expect(response.statusCode).toEqual(409)
        expect(response.body).toEqual({error: "email must be unique"})
    })

    it("should retrieve user after insert api", async () => {

        const newUser = {email: "elias@gmail.com", password: "1234"}
        const insertedUser = await request.post('/api/user')
            .send(newUser)

        const user = await request.get('/api/user')
            .query({email: newUser.email})

        expect(user.body.id).toEqual(insertedUser.body.id)
        expect(user.body.email).toEqual(newUser.email)
    })
})
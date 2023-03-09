import supertest, {SuperAgentTest} from "supertest"
import server from "../../src/app"
import {PrismaClient} from '@prisma/client'


describe("Task Api", () => {
    let request: SuperAgentTest
    beforeAll(() => {
        request = supertest.agent(server.connect())
    })
    afterAll((done) => {
        const client = new PrismaClient()
        client.task.deleteMany({}).then(res => {
            client.user.deleteMany({}).then(res => {})
        })
        server.disconnect()
        done()
    })

    it("should return 400 for task without title", async () => {
        const response = await request.post('/api/task').send({})
        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({error: "title is invalid"})
    })
    it("should return 201 for task insertion", async () => {
        const insertResponse = await request.post('/api/task').send({
            title: "new-title",
            status: 2
        })
        expect(insertResponse.statusCode).toBe(201)
        expect(insertResponse.body.id).not.toBe(-1)
        expect(insertResponse.body.id).toBeDefined()
    })

    it("should return task after invoke task insert api ", async () => {
        const insertResponse = await request.post('/api/task').send({
            title: "new-title",
            status: 2
        })

        const fetchResponse = await request.get(`/api/task/${insertResponse.body.id}`)
        expect(fetchResponse.statusCode).toBe(200)
        expect(fetchResponse.body[0].id).toBeDefined()
        expect(fetchResponse.body[0].id).toEqual(insertResponse.body.id)
        expect(fetchResponse.body[0].status).toEqual("CLOSE")
    })

    it("should assign task to a user and update it", async () => {

        const user = await request.post('/api/user').send({
            email:"e@gmail.com",
            password:"1234"
        })

        const insertResponse = await request.post('/api/task').send({
            title: "new-title",
        })

        const updatedTaskResponse = await request.put(`/api/task/${insertResponse.body.id}`)
            .send({
                user_id: user.body.id,
                status:1
            })

        expect(updatedTaskResponse.statusCode).toBe(200)
        expect(updatedTaskResponse.body.id).toBe(insertResponse.body.id)
        expect(updatedTaskResponse.body.userId).toBe(user.body.id)
        expect(updatedTaskResponse.body.status).toBe("DOING")
    })
})
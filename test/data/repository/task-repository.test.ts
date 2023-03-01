import {getDate} from "../../../src/utils"

const mockPrismaCreate = jest.fn()
const mockPrismaUpdate = jest.fn()

jest.mock('../../../src/data/db/db.client', () => {
    return {
        dbClient: {
            task: {
                create: mockPrismaCreate,
                update: mockPrismaUpdate
            }
        }
    }
})

import {Task} from "../../../src/data/entity"
import {TaskRepository} from "../../../src/data/repository"
import {dbClient} from '../../../src/data/db/db.client'
import {TaskDTO, TaskInsertDTO} from "../../../src/data/dto";
import {ValidationException} from "../../../src/data/exception";

describe("Task Repository: insert", () => {
    it("should return Task object after insert task in database", async () => {
        mockPrismaCreate.mockResolvedValue({
            id: 1,
            title: "title",
            status: 0,
            due_date: getDate(new Date()),
            description: "",
            user_id: -1
        })

        const repository: TaskRepository = new TaskRepository(dbClient)
        const task: Partial<Task> = {
            title:"title"
        }

        const result: TaskInsertDTO = await repository.insert(task)


        const createMethodInput = {
            data: {
                title: "title",
                status: 0,
                description: "",
                due_date: getDate(new Date())
            }
        }
        expect(mockPrismaCreate).toHaveBeenCalledWith(createMethodInput)
        expect(mockPrismaCreate).toHaveBeenCalledTimes(1)
        expect(result).toEqual({
            id: 1
        })
    })
    test("task with empty title is invalid", async () => {
        const repository: TaskRepository = new TaskRepository(dbClient)
        repository.insert({}).catch(e => {
            expect(e).toBeInstanceOf(ValidationException)
            expect(e.message).toEqual(`title is invalid`)
        })
    })
})

describe("Task Repository: update", () => {
    it("should return updated task", async () => {
        const repository: TaskRepository = new TaskRepository(dbClient);
        const updateObject: Partial<Task> = {
            id: 1,
            description: "new-description",
            status: Task.Status.CLOSE
        }

        mockPrismaUpdate.mockResolvedValue({
            id:1,
            description: updateObject.description,
            status: 2,
            title:"title",
            userId:-1,
            dueDate:getDate(new Date())
        })


        const updatedTask: TaskDTO = await repository.updateTask(updateObject)

        expect(updatedTask.status).toEqual("CLOSE")
        expect(updatedTask.description).toEqual(updateObject.description)
        expect(mockPrismaUpdate).toHaveBeenCalledTimes(1)
        expect(mockPrismaUpdate).toHaveBeenCalledWith(
            {
                where: {
                    id: updateObject.id,
                }, data: updateObject
            }
        )

    })
})
const mockInsert = jest.fn()
const mockRepository = jest.fn().mockImplementation(() => {
    return {
        insert:mockInsert
    }
})

jest.mock('../../src/data/repository',()  => {
    return {
        TaskRepository: mockRepository
    }
})


import {Task} from "../../src/data/entity";
import {TaskCreateDTO} from "../../src/data/dto";
import {ValidationException} from "../../src/data/exception";
import {TaskService} from "../../src/logic/task.service";
import {TaskRepository} from "../../src/data/repository";



describe("Task:Create", () => {
    test("task created with title and default open status with today's due date",() => {

        const [todayDate, todayTime] = new Date().toISOString().split("T")

        const service: TaskService = new TaskService(new TaskRepository())
        const task: Task  = service.createTask(
            new TaskCreateDTO("title",)
        )

        const [dueDate,dueTime] = task.dueDate.toISOString().split("T")
        expect(task.title).toBe("title")
        expect(task.status).toBe(Task.Status.OPEN)
        expect(dueDate).toEqual(todayDate)

    })

    test("task with empty title is invalid", () => {
        const service: TaskService = new TaskService(new TaskRepository())
        expect(() => service.createTask(new TaskCreateDTO("")))
            .toThrow(new ValidationException("title"))
    })
})

describe("Task: Insert", () => {

    it("should create task object and call repository object to insert data" , () => {
        const repository = new TaskRepository()
        const service = new TaskService(repository)

        const taskDto: TaskCreateDTO = new TaskCreateDTO("title")
        const task: Task  = service.createTask(taskDto)

        service.insertTask(taskDto)

        expect(mockInsert).toHaveBeenCalledTimes(1)
        expect(mockInsert).toHaveBeenCalledWith(task)
    })
})
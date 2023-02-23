import {TaskCreateDTO} from "../../src/data/dto";
import {Task} from "../../src/data/entity";
import {ValidationException} from "../../src/data/exception";

describe('Task:create', () =>  {

    test("task created with title and default open status with today's due date",() => {

        const [todayDate, todayTime] = new Date().toISOString().split("T")

        const task: Task  = new TaskCreateDTO().from("task")

        const [dueDate,dueTime] = task.dueDate.toISOString().split("T")
        expect(task.title).toBe("task")
        expect(task.status).toBe(Task.Status.OPEN)
        expect(dueDate).toEqual(todayDate)

    })

    test("task with empty title is invalid", () => {
        expect(() => new TaskCreateDTO().from(""))
            .toThrow(new ValidationException("title"))

    })
})
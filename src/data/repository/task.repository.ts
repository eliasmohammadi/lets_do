import {Task} from "../entity";
import {PrismaClient} from '@prisma/client'
import {TaskCreateDTO, TaskInsertedDTO, TaskUpdateDTO} from "../dto";
import {ValidationException} from "../exception";
import {getDate} from "../../utils";

export interface ITaskRepository {
    insert(taskDto: TaskCreateDTO): Promise<TaskInsertedDTO>
}

export class TaskRepository implements ITaskRepository {
    constructor(private readonly db: PrismaClient) {
    }

    createTask(taskDto: TaskCreateDTO): Task {
        if (taskDto.title === "" || !taskDto.title)
            throw new ValidationException("title")
        const status = taskDto.options.status || Task.Status.OPEN
        let dueDate = taskDto.options.dueDate || new Date()
        const description = taskDto.options.description || ""
        const owner = taskDto.options.owner || -1
        return new Task(taskDto.title,
            status,
            getDate(dueDate),
            description,
            owner);
    }

    async insert(taskDto: TaskCreateDTO): Promise<TaskInsertedDTO> {
        const task: Task = this.createTask(taskDto)
        const insertedTask = await this.db.task.create({
            data: {
                title: task.title,
                status: task.status,
                description: task.description,
                due_date: task.dueDate
            }
        })
        return Promise.resolve(
            new TaskInsertedDTO(
                insertedTask.id,
                insertedTask.title,
                insertedTask.status,
                insertedTask.due_date,
                insertedTask.description,
                insertedTask.user_id || -1,
            )
        )
    }

    async updateTask(task: Partial<Task>): Promise<TaskUpdateDTO> {
        const updatedTask = await this.db.task.update({
            where:{
                id: task.id
            },data: task
        })

        return Promise.resolve(
            new TaskUpdateDTO(
                updatedTask as unknown as Task
            )
        )

    }

}
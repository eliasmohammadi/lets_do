import {Task} from "../entity";
import {PrismaClient} from '@prisma/client'
import {TaskDTO, TaskInsertDTO} from "../dto";
import {ValidationException} from "../exception";
import {getDate} from "../../utils";
import { Mapper } from "../../utils/mapper";

export interface ITaskRepository {
    insert(task: Task): Promise<TaskInsertDTO>
    updateTask(task: Partial<Task>): Promise<TaskDTO>
}

export class TaskRepository implements ITaskRepository {
    private mapper: Mapper
    constructor(private readonly db: PrismaClient) {
        this.mapper = new Mapper()
    }

    private _createTask(task: Partial<Task>): Task {
        if (task.title === "" || !task.title)
            throw new ValidationException("title")
        const status = task.status || Task.Status.OPEN
        let dueDate = task.dueDate || new Date()
        const description = task.description || ""
        const owner = task.userId || -1
        return new Task(task.title,
            status,
            getDate(dueDate),
            description,
            owner);
    }

    async insert(task: Partial<Task>): Promise<TaskInsertDTO> {
        const taskInstance: Task = this._createTask(task)
        const insertedTask = await this.db.task.create({
            data: {
                title: taskInstance.title,
                status: taskInstance.status,
                description: taskInstance.description,
                due_date: taskInstance.dueDate
            }
        })
        return Promise.resolve(
            this.mapper.from<Task, TaskInsertDTO>(insertedTask as unknown as Task, (t) => {
                return {
                    id:t.id
                }
            })
        )
    }

    async updateTask(task: Partial<Task>): Promise<TaskDTO> {
        const updatedTask = await this.db.task.update({
            where:{
                id: task.id
            },data: task
        })

        return Promise.resolve(
            this.mapper.from<Task, TaskDTO>(updatedTask as unknown as Task, (t) => {
                return {
                    id:t.id,
                    userId:t.userId || -1,
                    description:t.description || "",
                    title: t.title,
                    dueDate: t.dueDate.toISOString(),
                    status: Task.Status[t.status]
                }
            })
        )

    }

}
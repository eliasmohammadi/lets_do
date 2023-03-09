import {Task} from "../entity";
import {PrismaClient} from '@prisma/client'
import {TaskDTO, TaskIdDTO} from "../dto";
import {ValidationException} from "../exception";
import {getDate} from "../../utils";
import {Mapper} from "../../utils/mapper";

export interface ITaskRepository {
    insert(task: Task): Promise<TaskIdDTO>

    updateTask(task: Partial<Task>): Promise<TaskDTO>

    deleteTask(id: Task["id"]): Promise<TaskIdDTO>

    fetchBy(prediction: Partial<Task>): Promise<TaskDTO[]>

}

export class TaskRepository implements ITaskRepository {


    constructor(private readonly db: PrismaClient) {

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

    async insert(task: Partial<Task>): Promise<TaskIdDTO> {
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
            Mapper.from<Task, TaskIdDTO>(insertedTask as unknown as Task, (t) => {
                return {
                    id: t.id
                }
            })
        )
    }

    async updateTask(task: Partial<Task>): Promise<TaskDTO> {


        const updatedTask = await this.db.task.update({
            where: {
                id: task.id
            }, data: task
        })

        return Promise.resolve(
            Mapper.from<typeof updatedTask, TaskDTO>(updatedTask, (t) => {
                return {
                    id: t.id,
                    userId: t.user_id || -1,
                    description: t.description || "",
                    title: t.title,
                    dueDate: t.due_date.toISOString(),
                    status: Task.Status[t.status]
                }
            })
        )

    }
    async deleteTask(id: number): Promise<TaskIdDTO> {
        const deletedItem = await this.db.task.delete({
            where:{
                id:id
            }
        }) as unknown as Task
        return Promise.resolve(
            Mapper.from<Task, TaskIdDTO>(deletedItem,(t) => {
                return {
                    id:t.id
                }
            })
        )
    }

    async fetchBy(prediction: Partial<Task>): Promise<TaskDTO[]> {
        const  tasksPrisma = await this.db.task.findMany({
            where:prediction
        })

        return Promise.resolve(
            Mapper.from<typeof tasksPrisma, TaskDTO[]>(tasksPrisma , t => {
                return t.map(o => {
                    return {
                        id: o.id,
                        title: o.title,
                        description: o.description,
                        userId:o.user_id,
                        status:Task.Status[o.status],
                        dueDate: o.due_date.toISOString()
                    }
                })

            })
        )
    }

}
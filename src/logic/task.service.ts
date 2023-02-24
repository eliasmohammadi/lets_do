import {Task} from "../data/entity";
import {TaskCreateDTO} from "../data/dto";
import {ValidationException} from "../data/exception";
import {ITaskRepository} from "../data/repository";
import {getDate} from "../utils";

export class TaskService {
    constructor(private readonly repo:ITaskRepository) {

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
    async insertTask(taskDto: TaskCreateDTO): Promise<TaskCreateDTO> {
            const newTask: Task = this.createTask(taskDto)
            const insertedTask = await this.repo.insert(newTask)
            return Promise.resolve(insertedTask as unknown as TaskCreateDTO)


    }
}
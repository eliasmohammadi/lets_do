import {Task} from "../entity";
import {ValidationException} from "../exception";

export class TaskCreateDTO {
    private readonly _title: string
    private readonly _options: Partial<Task.Options>

    constructor(title: string, options: Partial<Task.Options> = {}) {
        this._title = title
        this._options = options
    }

    get title(): string {
        return this._title
    }

    get options(): Partial<Task.Options> {
        return this._options
    }
}

export class TaskInsertedDTO {

    private id: number
    private title: string
    private description: string
    private userId?: number
    private status: string
    private dueDate: string

    constructor(id: number, title: string,
                status: number = 0, dueDate: Date, description: string | null, owner?: number) {

        this.id = id
        this.title = title
        this.description = description || ""
        this.userId = owner || -1
        this.status = Task.Status[status]
        this.dueDate = dueDate.toISOString()

    }
}
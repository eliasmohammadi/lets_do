import {Task} from "../entity";

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

export class TaskUpdateDTO {
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }
    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }
    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
    get userId(): number  {
        return this._userId || -1;
    }

    set userId(value: number) {
        this._userId = value;
    }
    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }
    get dueDate(): string {
        return this._dueDate;
    }

    set dueDate(value: string) {
        this._dueDate = value;
    }
    private _id: number
    private _title: string
    private _description: string
    private _userId?: number
    private _status: string
    private _dueDate: string

    constructor(task: Task) {
        this._id = task.id
        this._title = task.title
        this._description = task.description
        this._userId = task.userId
        this._status = Task.Status[task.status]
        this._dueDate = task.dueDate.toISOString()
    }
}
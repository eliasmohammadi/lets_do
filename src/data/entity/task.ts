export class Task {

    private _title: string
    private _dueDate: Date
    private _status : Task.Status
    private _description: string
    private _userId: number
    constructor(title: string,
                status: Task.Status,
                dueDate: Date,
                description: string,
                userId: number) {

        this._title = title
        this._dueDate = dueDate
        this._status = status
        this._description = description
        this._userId = userId
    }
    get userId(): number {
        return this._userId;
    }

    set userId(value: number) {
        this._userId = value;
    }
    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
    set dueDate(value: Date) {
        this._dueDate = value;
    }
    set status(value: Task.Status) {
        this._status = value;
    }
    get dueDate(): Date {
        return this._dueDate;
    }
    get title(): string {
        return this._title;
    }
    set title(value: string) {
        this._title = value;
    }
    get status(): Task.Status {
        return this._status;
    }
}
export namespace Task {
    export enum Status {
        OPEN,
        DOING,
        CLOSE
    }

    export interface Options {
        status: Task.Status,
        description: string,
        dueDate: Date,
        owner: number
    }
}
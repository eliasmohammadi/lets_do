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
        return  this._title
    }

    get options(): Partial<Task.Options> {
        return this._options
    }


}
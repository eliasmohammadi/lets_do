import {Task} from "../entity";

export interface ITaskRepository {
    insert(task: Task): Promise<Task>
}
export class TaskRepository implements ITaskRepository{
    constructor() {
    }
    insert(task: Task): Promise<Task> {
        return Promise.resolve('' as unknown as Task);
    }

}
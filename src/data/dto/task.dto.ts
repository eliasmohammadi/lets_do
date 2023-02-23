import {Task} from "../entity";
import {ValidationException} from "../exception";

export class TaskCreateDTO {
    from(title: string,
         status: Task.Status = Task.Status.OPEN,
         dueDate: Date = new Date(),
         description: string = "",
         userId : number = -1
    ): Task {
        if (title === "" || !title)
            throw new ValidationException("title")
        return new Task(title,status,dueDate,description,userId);
    }
}
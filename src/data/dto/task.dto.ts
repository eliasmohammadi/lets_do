import {Task} from "../entity";


export type TaskInsertDTO = Pick<Task,'id'>

export type TaskDTO = {
    id: Task['id']
    title: string
    description: string
    userId: number
    status : string
    dueDate: string
}



import {Task} from "../entity";


export type TaskIdDTO = Pick<Task,'id'>

export type TaskDTO = {
    id: Task['id']
    title: string
    description: string | null
    userId: number | null
    status : string
    dueDate: string
}



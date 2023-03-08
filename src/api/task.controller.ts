import {Router, Request, Response} from 'express'
import { TaskRepository } from '../data/repository'
import {dbClient} from '../data/db/db.client'
import { ValidationException } from '../data/exception'
const router = Router()

router.route('/task')
    .post(async (req: Request, res: Response) => {
        try {
            const {title, description, dueDate, userId, status} = req.body
            const taskRepository = new TaskRepository(dbClient)
            const result = await taskRepository.insert({
                title: title,
                description: description,
                status: status,
                userId: userId,
                dueDate: dueDate
            })
            return res.status(201).send(result)
        }catch (e) {
            if(e instanceof ValidationException)
                res.status(400).send({error:e.message})
        }
    })

router.route("/task/:id")
    .get(async (req: Request, res:Response) => {
        const {id}  = req.params
        const taskRepository = new TaskRepository(dbClient)
        const result = await taskRepository.fetchBy({
            id: +id
        })
        return res.status(200).send(result)
    })

export default router
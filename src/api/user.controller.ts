import {Router, Request, Response} from "express"
import {UserRepository} from '../data/repository'
import {dbClient} from '../data/db/db.client'
import {DuplicateRecordException, RequireFieldException, ValidationException} from "../data/exception";

const router = Router();

router.route('/user')
    .post(async (req: Request, res: Response) => {
        try {
            const {email, password} = req.body
            const repository = new UserRepository(dbClient)
            const result = await repository.insert(email, password)
            return res.status(201).send(result)
        } catch (e) {
            if (e instanceof ValidationException) {
                res.status(400).send({error: e.message})
            } else if (e instanceof RequireFieldException) {
                res.status(400).send({error: e.message})
            } else if (e instanceof DuplicateRecordException){
                res.status(409).send({error:e.message})
            }
        }
    })


router.route('/user')
    .get(async (req: Request, res: Response) => {
        const {email} = req.query
        const repository = new UserRepository(dbClient)
        const result = await repository.fetchBy(email as string)
        return res.status(200).send(result)
    })

export default router
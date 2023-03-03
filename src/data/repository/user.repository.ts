import { UserIdDTO } from "../dto";
import { User } from "../entity";
import {RequireFieldException, ValidationException} from "../exception";
import {createHashPassword, createRandomSalt, validateEmail} from "../../utils";
import {PrismaClient} from '@prisma/client'
import { Mapper } from "../../utils/mapper";
export interface IUserRepository {
    insert(email: string, password: string):Promise<UserIdDTO>
}

export class UserRepository implements IUserRepository {

    constructor(private readonly db:PrismaClient) {

    }
    async insert(email: string, password: string): Promise<UserIdDTO> {
        // hash password
        // generate salt
        // validate email
        if (!email || !password)
            throw new RequireFieldException(["email", "password"])
        if (!validateEmail(email))
            throw new ValidationException("email")
        const salt = createRandomSalt()
        const user: User =new User(email, salt, createHashPassword(password,salt))

        const newUser = await this.db.user.create({
            data:{
                email: user.email,
                salt: user.salt,
                hash_password: user.hashPassword
            }
        }) as unknown as User

        const result = Mapper.from<User,UserIdDTO>(newUser , (u) => {
            return {
                id: u.id
            }
        })

        return Promise.resolve(result)

    }

}
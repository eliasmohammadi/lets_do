import {UserDTO, UserIdDTO} from "../dto";
import {User} from "../entity";
import {DuplicateRecordException, RequireFieldException, ValidationException} from "../exception";
import {createHashPassword, createRandomSalt, validateEmail} from "../../utils";
import {Prisma, PrismaClient} from '@prisma/client'
import {Mapper} from "../../utils/mapper";

export interface IUserRepository {
    insert(email: string, password: string): Promise<UserIdDTO>

    fetchBy(email: string): Promise<UserDTO>
}

export class UserRepository implements IUserRepository {

    constructor(private readonly db: PrismaClient) {

    }

    async insert(email: string, password: string): Promise<UserIdDTO> {
        if (!email || !password)
            throw new RequireFieldException(["email", "password"])
        if (!validateEmail(email))
            throw new ValidationException("email")
        const salt = createRandomSalt()
        const user: User = new User(email, salt, createHashPassword(password, salt))
        try {
            const newUser = await this.db.user.create({
                data: {
                    email: user.email,
                    salt: user.salt,
                    hash_password: user.hashPassword
                }
            }) as unknown as User

            const result = Mapper.from<User, UserIdDTO>(newUser, (u) => {
                return {
                    id: u.id
                }
            })

            return Promise.resolve(result)
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002")
                    return Promise.reject(new DuplicateRecordException(["email"]))
            }
            return Promise.reject(e)
        }


    }

    async fetchBy(email: string): Promise<UserDTO> {
        const user = await this.db.user.findUnique({
            where: {
                email: email
            }
        }) as unknown as User

        if (user)
            return Promise.resolve(Mapper.from<User, UserDTO>(user, (u) => {
                return {
                    id: u.id,
                    email: u.email
                }
            }))
        return Promise.resolve({
            id:-1,
            email:""
        })

    }

}
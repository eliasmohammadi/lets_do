import {User} from "../entity";

export type UserIdDTO = Pick<User, "id">
export type UserDTO = Omit<User, 'hashPassword' | 'salt'>

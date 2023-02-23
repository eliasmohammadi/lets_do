import {User} from "../entity";
import {RequireFieldException, ValidationException} from "../exception";
import {createHashPassword, validateEmail} from "../../utils";

export class UserCreateDTO {
    from(email: string, password: string): User {
        if (!email || !password)
            throw new RequireFieldException(["email", "password"])
        if (!validateEmail(email))
            throw new ValidationException("email")
        return new User(email, createHashPassword(password))
    }
}
import {User} from "../entity";
import {RequireFieldException, ValidationException} from "../exception";
import {createHashPassword, validateEmail, createRandomSalt} from "../../utils";

export class UserCreateDTO {
    from(email: string, password: string): User {
        if (!email || !password)
            throw new RequireFieldException(["email", "password"])
        if (!validateEmail(email))
            throw new ValidationException("email")

        const salt = createRandomSalt()
        return new User(
            email, 
            salt,
            createHashPassword(password,salt)
            )
    }
}
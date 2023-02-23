import {UserCreateDTO} from "../../src/data/dto";
import {RequireFieldException, ValidationException} from "../../src/data/exception";
import {User} from "../../src/data/entity";
import exp from "constants";

describe('User:create', () => {

    test('user without email or password is not validate',() => {

        expect(() => new UserCreateDTO().from("",""))
            .toThrow(
            new RequireFieldException(["email", "password"])
        );
    })

    test("user creation failed when email has incorrect format", () => {
        const email: string = "incorrect_email_address";
        const password: string = "12345";
        expect(() => new UserCreateDTO().from(email, password))
            .toThrow(
                new ValidationException("email")
            )
    })

    test("user created with email and password", () => {
        const email = "e@gmail.com"
        const password = "12345"
        const user  = new UserCreateDTO().from(email, password)
        expect(user).toBeInstanceOf(User)
        expect(user.email).toEqual(email)
    })

    test("password must be hash through user creation",() => {
        const email = "e@gmail.com";
        const password = "1234";
        const user = new UserCreateDTO().from(email, password)
        expect(user.password).not.toEqual(password)
    })
})
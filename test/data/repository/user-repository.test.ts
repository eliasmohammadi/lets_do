const mockPrismaCreate = jest.fn()
const mockPrismaFindUnique = jest.fn()
jest.mock('../../../src/data/db/db.client', () => {
    return {
        dbClient: {
            user: {
                create: mockPrismaCreate,
                findUnique: mockPrismaFindUnique
            }
        }
    }
})


import {dbClient} from '../../../src/data/db/db.client'
import {DuplicateRecordException, RequireFieldException, ValidationException} from "../../../src/data/exception";
import {IUserRepository, UserRepository} from '../../../src/data/repository';
import {UserDTO, UserIdDTO} from '../../../src/data/dto';
import * as libs from '../../../src/utils/libs'
import {Prisma} from '@prisma/client'

describe("User: Insert", () => {
    test('user without email or password is not validate', () => {
        const repository: IUserRepository = new UserRepository(dbClient)

        repository.insert("", "").catch(e => {
            expect(e).toBeInstanceOf(RequireFieldException)
            expect(e.message).toEqual("missing fields: email,password")
        })
    })

    test("user creation failed when email has incorrect format", () => {
        const email: string = "incorrect_email_address";
        const password: string = "12345";
        const repository: IUserRepository = new UserRepository(dbClient)

        repository.insert(email, password).catch(e => {
            expect(e).toBeInstanceOf(ValidationException)
            expect(e.message).toEqual("email is invalid")
        })
    })
    test("user created with email and password", async () => {
        const mockResponse = {id: 1}
        mockPrismaCreate.mockResolvedValue(mockResponse)

        const saltSpy = jest.spyOn(libs, 'createRandomSalt').mockReturnValue("salt")
        const hashSpy = jest.spyOn(libs, 'createHashPassword').mockReturnValue("hash")


        const email = "e@gmail.com"
        const password = "12345"

        const repository: IUserRepository = new UserRepository(dbClient)

        const actual: UserIdDTO = await repository.insert(email, password)

        expect(actual.id).toEqual(mockResponse.id)
        expect(mockPrismaCreate).toHaveBeenCalledTimes(1)
        expect(mockPrismaCreate).toHaveBeenCalledWith({
            data: {
                email: email,
                salt: "salt",
                hash_password: "hash"
            }
        })
        hashSpy.mockRestore()
        saltSpy.mockRestore()

    })

    test("password must be hash through user creation", async () => {

        const hashSpy = jest.spyOn(libs, 'createHashPassword')

        const email = "e@gmail.com";
        const password = "1234";

        const repository: IUserRepository = new UserRepository(dbClient)
        await repository.insert(email, password)

        expect(hashSpy).toHaveBeenCalledTimes(1)
        hashSpy.mockRestore()
    })

    test("users with same email are invalid", async () => {

        mockPrismaCreate.mockImplementation(() => {
            throw new Prisma.PrismaClientKnownRequestError("", {code: "P2002", clientVersion: "1"})
        })
        const repository: IUserRepository = new UserRepository(dbClient)
        repository.insert("same@email.com", "1234").catch(e => {
            expect(e).toBeInstanceOf(DuplicateRecordException)
            mockPrismaCreate.mockRestore()
        })


    })
})

describe("User: Find", () => {
    it("should return UserDTO when search an email", async () => {

        const fakeUser = {
            id: 1,
            email: "elias.mohammady91@gmail.com"
        }

        mockPrismaFindUnique.mockResolvedValue(fakeUser)

        const repository: IUserRepository = new UserRepository(dbClient)


        const user: UserDTO = await repository.fetchBy(fakeUser.email)

        expect(user.email).toEqual(fakeUser.email)
        expect(mockPrismaFindUnique).toHaveBeenCalledTimes(1)
        expect(mockPrismaFindUnique).toHaveBeenCalledWith({
            where: {
                email: fakeUser.email
            }
        })
        mockPrismaFindUnique.mockRestore()
    })
    it("should return an empty user when use not found", async () => {
        mockPrismaFindUnique.mockResolvedValue(null)
        const repository: IUserRepository = new UserRepository(dbClient)
        const user = await repository.fetchBy("some-email")
        expect(user).toEqual({
            id: -1,
            email: ""
        })
    })
})
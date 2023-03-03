export class User {
    private _id: number = -1
    private readonly _email: string
    private readonly _hashPassword: string
    private _name: string = ""
    private readonly _salt : string = ""
    constructor(email: string, salt: string, hashPassword: string) {
        this._email = email
        this._hashPassword = hashPassword
        this._salt = salt
        
    }

    get id():number {
        return this._id
    }
    set id(value: number) {
        this._id = value
    }

    get email():string {
        return this._email
    }
    get hashPassword(): string {
        return this._hashPassword
    }

    set name(value: string) {
        this._name = value
    }

    get name(): string {
        return this._name
    }
    get salt(): string {
        return this._salt
    }

}
export class User {
    private readonly _email: string
    private readonly hashPassword: string
    private _name: string = ""
    private _salt : string = ""
    constructor(email: string, salt: string, hashPassowrd: string) {
        this._email = email
        this.hashPassword = hashPassowrd
        this._salt = salt
        
    }

    get email():string {
        return this._email
    }
    get password(): string {
        return this.hashPassword
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
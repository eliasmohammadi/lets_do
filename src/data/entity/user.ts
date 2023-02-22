export class User {
    private readonly _email: string
    private readonly _password: string
    constructor(email: string, password: string) {
        this._email = email
        this._password = password
    }

    get email():string {
        return this._email
    }
    get password(): string {
        return this._password
    }

}
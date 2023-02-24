import {randomBytes, createHash} from 'crypto'

export function validateEmail(email: string): boolean {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return expression.test(email);
}

export function createRandomSalt(): string {
    return randomBytes(16).toString('hex')
}

export function createHashPassword(password: string,salt?: string): string {
    /*
     *  don't write test because this block of code is not a custom code!!!
     * */
    let updatedPass: string;
    if (salt)
        updatedPass = salt + password
    else
        updatedPass = createRandomSalt() + password
    return createHash('sha256')
        .update(
            updatedPass)
        .digest('hex')
}

export function getDate(date:Date): Date
export function getDate(isoString:string): Date
export function getDate(date: Date | string) : Date{
    if (typeof  date === "string") {
        return new Date(date.split("T")[0])
    }else if (typeof date === "object") {
        return new Date(date.toISOString().split("T")[0])
    }
    return new Date()
}
import {randomBytes, createHash} from 'crypto'

export function validateEmail(email: string): boolean {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return expression.test(email);
}

export function createRandomSalt(): string {
    return randomBytes(16).toString('hex')
}

export function createHashPassword(password: string): string {
    /*
     *  don't write test because this block of code is not a custom code!!!
     * */
    const updatedPass = createRandomSalt() + password
    return createHash('sha256')
        .update(
            updatedPass)
        .digest('hex')
}
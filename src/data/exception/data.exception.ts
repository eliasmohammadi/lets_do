export class RequireFieldException extends Error {
    constructor(requiredFields:string[]) {
        super(`missing fields: ${requiredFields}`);
    }
}

export class ValidationException extends Error {
    constructor(field: string) {
        super(`${field} is invalid`);
    }
}
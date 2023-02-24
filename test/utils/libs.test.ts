import {validateEmail, getDate} from "../../src/utils";

describe("email validation", () => {

    it("should return false for invalid email", () => {
        const email = "invalid_email"
        expect(validateEmail(email)).toBeFalsy()
    })

    it("should return true for valid email", () => {
        const email = "e@gmail.com"
        expect(validateEmail(email)).toBeTruthy()
    })

    it("should return date part from a Date object", () => {
        const isoDate = "2023-02-24T00:12:34.567Z"
        expect(getDate(isoDate)).toEqual(new Date("2023-02-24T00:00:00.000Z"))
    })


})
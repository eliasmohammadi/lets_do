import {validateEmail} from "../../src/utils";

describe("email validation", () => {

    it("should return false for invalid email", () => {
        const email = "invalid_email"
        expect(validateEmail(email)).toBeFalsy()
    })

    it("should return true for valid email", () => {
        const email = "e@gmail.com"
        expect(validateEmail(email)).toBeTruthy()
    })


})
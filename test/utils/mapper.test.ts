import { Mapper } from "../../src/utils/mapper"

describe("Mapper", () => {
    it("should map and convert type T to U", () => {

        type FirstType = {
            first_name: string
            last_name: string
        }
        type SecondType = {
            fullName: string
        }

        const obj: FirstType = {
            first_name:"Elias",
            last_name: "Mohammadi"
        }

        const actual = Mapper.from<FirstType, SecondType>(obj,(o) => {
            return {
                fullName: `${o.first_name} ${o.last_name}`
            }
        })

        expect(actual.fullName).toEqual(`${obj.first_name} ${obj.last_name}`)





    })
})